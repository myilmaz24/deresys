#!/usr/bin/env bash
#
# Cloudflare IP aralıklarını çeker ve iki yere yazar:
#   1) mod_remoteip güvenilir proxy listesi  → gerçek ziyaretçi IP'si doğru okunur
#   2) ufw kuralları                          → 443'e yalnızca Cloudflare erişir
#
# Cloudflare aralıkları nadiren ama değişir. Bu betik systemd timer ile
# haftalık çalıştırılır (provision.sh kurar).
#
#   sudo /usr/local/sbin/cloudflare-ips.sh

set -euo pipefail

CONF="/etc/apache2/conf-available/deresys-cloudflare.conf"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[[ $EUID -eq 0 ]] || { echo "root olarak çalıştırın" >&2; exit 1; }

echo "==> Cloudflare aralıkları indiriliyor"
curl -fsS --max-time 20 https://www.cloudflare.com/ips-v4 -o "$TMP/v4"
curl -fsS --max-time 20 https://www.cloudflare.com/ips-v6 -o "$TMP/v6"

# Doğrulama: beklenmedik/boş yanıtla sistemi kilitlemeyelim
V4_COUNT=$(grep -cE '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+$' "$TMP/v4" || true)
V6_COUNT=$(grep -cE '^[0-9a-fA-F:]+/[0-9]+$'                  "$TMP/v6" || true)
if [[ "$V4_COUNT" -lt 5 ]]; then
  echo "HATA: IPv4 listesi beklenenden kısa ($V4_COUNT). Değişiklik yapılmadı." >&2
  exit 1
fi
echo "    IPv4: $V4_COUNT aralık, IPv6: $V6_COUNT aralık"

echo "==> mod_remoteip yapılandırması"
{
  echo "# Otomatik üretildi: cloudflare-ips.sh — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "# Elle düzenlemeyin; bir sonraki çalıştırmada üzerine yazılır."
  echo
  echo "<IfModule mod_remoteip.c>"
  echo "    # Gerçek ziyaretçi IP'si bu başlıktan okunur."
  echo "    # Yalnızca aşağıdaki aralıklardan gelen bağlantılarda dikkate alınır,"
  echo "    # yani başlığı taklit eden doğrudan bağlantılar yok sayılır."
  echo "    RemoteIPHeader CF-Connecting-IP"
  while read -r cidr; do [[ -n "$cidr" ]] && echo "    RemoteIPTrustedProxy $cidr"; done < "$TMP/v4"
  while read -r cidr; do [[ -n "$cidr" ]] && echo "    RemoteIPTrustedProxy $cidr"; done < "$TMP/v6"
  echo "</IfModule>"
} > "$TMP/conf"

if [[ -f "$CONF" ]] && diff -q <(tail -n +3 "$CONF") <(tail -n +3 "$TMP/conf") >/dev/null 2>&1; then
  echo "    değişiklik yok"
else
  install -m 644 "$TMP/conf" "$CONF"
  a2enconf -q deresys-cloudflare
  if apache2ctl configtest >/dev/null 2>&1; then
    systemctl reload apache2
    echo "    güncellendi, apache reload edildi"
  else
    echo "HATA: configtest başarısız, apache reload EDİLMEDİ" >&2
    apache2ctl configtest
    exit 1
  fi
fi

echo "==> ufw kuralları"
# Önceki Cloudflare kurallarını temizle (yorum etiketiyle işaretli olanlar)
ufw status numbered | grep "cloudflare-443" | grep -oE '^\[[ 0-9]+\]' | tr -d '[] ' | sort -rn | \
  while read -r n; do ufw --force delete "$n" >/dev/null; done

while read -r cidr; do
  [[ -n "$cidr" ]] && ufw allow proto tcp from "$cidr" to any port 443 comment "cloudflare-443" >/dev/null
done < "$TMP/v4"
while read -r cidr; do
  [[ -n "$cidr" ]] && ufw allow proto tcp from "$cidr" to any port 443 comment "cloudflare-443" >/dev/null
done < "$TMP/v6"

echo "    443 portu yalnızca Cloudflare'e açık"
echo "==> Tamam"
