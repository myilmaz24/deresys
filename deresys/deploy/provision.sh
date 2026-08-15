#!/usr/bin/env bash
#
# /var/www yapısını ve Cloudflare arkasında çalışacak Apache2 kurulumunu yapar.
# Ubuntu/Debian, root olarak çalıştırılır. Tekrar çalıştırılabilir (idempotent).
#
#   sudo bash provision.sh
#
# ÖN KOŞUL: Cloudflare Origin Certificate dosyaları hazır olmalı —
#   /etc/ssl/cloudflare/deresys.com.tr.pem
#   /etc/ssl/cloudflare/deresys.com.tr.key
# Nasıl üretileceği DEPLOY.md bölüm 2'de.
#
# SSH sertleştirmesi bu betikte YAPILMAZ — yanlış bir adım oturumu kesebilir.

set -euo pipefail

SITE="deresys.com.tr"
DEPLOY_USER="deploy"
WEB_GROUP="www-data"
WWW="/var/www"
SITE_ROOT="$WWW/$SITE"
CFDIR="/etc/ssl/cloudflare"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ $EUID -eq 0 ]] || { echo "root olarak çalıştırın: sudo bash $0" >&2; exit 1; }

echo "==> Paketler"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq apache2 ssl-cert rsync ufw fail2ban unattended-upgrades curl

echo "==> Apache modülleri"
a2enmod -q headers rewrite ssl deflate http2 expires remoteip
a2dissite -q 000-default default-ssl 2>/dev/null || true

if apache2ctl -M 2>/dev/null | grep -q mpm_prefork; then
  echo "    UYARI: mpm_prefork etkin — HTTP/2 çalışmaz."
  echo "           Sunucuda PHP yoksa: a2dismod php8.3 mpm_prefork && a2enmod mpm_event"
fi

echo "==> Deploy kullanıcısı"
if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --system --group --shell /bin/bash --home "/home/$DEPLOY_USER" "$DEPLOY_USER"
  echo "    $DEPLOY_USER oluşturuldu"
else
  echo "    $DEPLOY_USER zaten var"
fi
usermod -aG "$WEB_GROUP" "$DEPLOY_USER"
passwd -l "$DEPLOY_USER" >/dev/null 2>&1 || true

install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"

echo "==> /var/www yapısı"
install -d -m 755 -o root -g root "$WWW"
install -d -m 755 -o root -g root "$WWW/_default"
install -d -m 750 -o "$DEPLOY_USER" -g "$WEB_GROUP" "$SITE_ROOT"
install -d -m 750 -o "$DEPLOY_USER" -g "$WEB_GROUP" "$SITE_ROOT/releases"
install -d -m 750 -o "$DEPLOY_USER" -g "$WEB_GROUP" "$SITE_ROOT/shared"
install -d -m 750 -o "$DEPLOY_USER" -g "$WEB_GROUP" "$SITE_ROOT/bin"
install -m 750 -o "$DEPLOY_USER" -g "$WEB_GROUP" "$HERE/bin/activate.sh" "$SITE_ROOT/bin/activate.sh"

echo "==> İlk sürüm (bakım sayfası)"
BOOTSTRAP="$SITE_ROOT/releases/00000000T000000Z-0000000"
if [[ ! -e "$SITE_ROOT/current" ]]; then
  install -d -m 750 -o "$DEPLOY_USER" -g "$WEB_GROUP" "$BOOTSTRAP"
  cat > "$BOOTSTRAP/index.html" <<'HTML'
<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<title>DERESYS</title><meta name="robots" content="noindex">
<style>body{background:#000;color:#fff;font-family:system-ui,sans-serif;
display:grid;place-items:center;min-height:100vh;margin:0}p{color:#8A8A8A}</style>
</head><body><div><h1>DERESYS</h1><p>Yayına hazırlanıyor.</p></div></body></html>
HTML
  chown -R "$DEPLOY_USER:$WEB_GROUP" "$BOOTSTRAP"
  chmod -R u=rwX,g=rX,o= "$BOOTSTRAP"
  ln -sfn "$BOOTSTRAP" "$SITE_ROOT/current"
  chown -h "$DEPLOY_USER:$WEB_GROUP" "$SITE_ROOT/current"
  echo "    bakım sayfası kuruldu"
else
  echo "    current zaten var, dokunulmadı"
fi

echo "==> Cloudflare sertifikaları"
install -d -m 700 -o root -g root "$CFDIR"
MISSING=0
for f in "$SITE.pem" "$SITE.key"; do
  if [[ ! -f "$CFDIR/$f" ]]; then echo "    EKSİK: $CFDIR/$f"; MISSING=1; fi
done
chmod 600 "$CFDIR"/*.key 2>/dev/null || true
chmod 644 "$CFDIR"/*.pem 2>/dev/null || true

# Authenticated Origin Pulls için Cloudflare istemci CA'sı
if [[ ! -f "$CFDIR/origin-pull-ca.pem" ]]; then
  if curl -fsS --max-time 20 \
      https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem \
      -o "$CFDIR/origin-pull-ca.pem"; then
    chmod 644 "$CFDIR/origin-pull-ca.pem"
    echo "    origin-pull-ca.pem indirildi"
  else
    echo "    UYARI: origin-pull-ca.pem indirilemedi, elle koyulmalı"
    MISSING=1
  fi
fi

echo "==> Apache yapılandırması"
install -m 644 "$HERE/apache/deresys-hardening.conf" /etc/apache2/conf-available/deresys-hardening.conf
install -m 644 "$HERE/apache/deresys-security.conf"  /etc/apache2/conf-available/deresys-security.conf
install -m 644 "$HERE/apache/000-default-deny.conf"  /etc/apache2/sites-available/000-default-deny.conf
install -m 644 "$HERE/apache/$SITE.conf"             /etc/apache2/sites-available/$SITE.conf
a2enconf -q deresys-hardening deresys-security
a2ensite -q 000-default-deny

# Ubuntu'nun security.conf'u conf-enabled içinde alfabetik olarak bizden SONRA
# yüklenir ve ServerTokens/ServerSignature değerlerimizi ezer. Kaynağı düzeltiyoruz.
if [[ -f /etc/apache2/conf-available/security.conf ]]; then
  [[ -f /etc/apache2/conf-available/security.conf.deresys.bak ]] || \
    cp /etc/apache2/conf-available/security.conf /etc/apache2/conf-available/security.conf.deresys.bak
  sed -i -E 's|^[[:space:]]*ServerTokens .*|ServerTokens Prod|'      /etc/apache2/conf-available/security.conf
  sed -i -E 's|^[[:space:]]*ServerSignature .*|ServerSignature Off|' /etc/apache2/conf-available/security.conf
  sed -i -E 's|^[[:space:]]*TraceEnable .*|TraceEnable Off|'         /etc/apache2/conf-available/security.conf
  echo "    security.conf değerleri sertleştirildi"
fi

echo "==> Cloudflare IP listesi"
install -m 750 -o root -g root "$HERE/bin/cloudflare-ips.sh" /usr/local/sbin/cloudflare-ips.sh

cat > /etc/systemd/system/cloudflare-ips.service <<'UNIT'
[Unit]
Description=Cloudflare IP aralıklarını Apache ve ufw ile eşitle
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/cloudflare-ips.sh
UNIT

cat > /etc/systemd/system/cloudflare-ips.timer <<'UNIT'
[Unit]
Description=Cloudflare IP aralıklarını haftalık eşitle

[Timer]
OnCalendar=weekly
RandomizedDelaySec=1h
Persistent=true

[Install]
WantedBy=timers.target
UNIT

systemctl daemon-reload
systemctl enable --now cloudflare-ips.timer >/dev/null 2>&1 || true

echo "==> Güvenlik duvarı"
ufw allow OpenSSH >/dev/null
# 80 bilinçli olarak açılmıyor: HTTP→HTTPS yönlendirmesi Cloudflare uçta yapar.
ufw --force delete allow 'Apache Full' >/dev/null 2>&1 || true
ufw --force delete allow 80/tcp        >/dev/null 2>&1 || true
if ! ufw status | grep -q "Status: active"; then
  echo "    ufw etkinleştiriliyor (SSH zaten izinli)"
  ufw --force enable >/dev/null
fi
# 443'ü yalnızca Cloudflare'e aç
/usr/local/sbin/cloudflare-ips.sh || echo "    UYARI: Cloudflare IP eşitlemesi başarısız"

echo "==> Port 80 kapatılıyor"
# Cloudflare uçta HTTP→HTTPS yönlendirmesi yapar; origin'in 80'i dinlemesine
# gerek yok. Dinlerse, hiçbir vhost eşleşmediğinde Apache ana sunucu
# yapılandırmasıyla /var/www/html'i servis eder ve Ubuntu varsayılan sayfası
# dışarı sızar. Güvenlik duvarı bunu zaten engeller; bu ikinci katman.
if grep -qE '^[[:space:]]*Listen 80([[:space:]]|$)' /etc/apache2/ports.conf; then
  [[ -f /etc/apache2/ports.conf.deresys.bak ]] || \
    cp /etc/apache2/ports.conf /etc/apache2/ports.conf.deresys.bak
  sed -i -E 's|^([[:space:]]*)(Listen 80([[:space:]].*)?)$|\1# \2  # deresys: Cloudflare uçta yönlendiriyor|' \
    /etc/apache2/ports.conf
  echo "    Listen 80 devre dışı"
fi
# Ubuntu varsayılan içerik dizini boşaltılır (ana sunucu DocumentRoot'u)
if [[ -f /var/www/html/index.html ]]; then
  rm -f /var/www/html/index.html
  echo "    /var/www/html/index.html silindi"
fi

echo "==> Otomatik güvenlik güncellemeleri"
dpkg-reconfigure -f noninteractive unattended-upgrades >/dev/null 2>&1 || true
systemctl enable --now fail2ban >/dev/null 2>&1 || true

echo "==> Yapılandırma testi"
apache2ctl configtest

echo
if [[ "$MISSING" -eq 1 ]]; then
  echo "==> Sertifika dosyaları eksik. Site vhost'u ETKİNLEŞTİRİLMEDİ."
  echo "    DEPLOY.md bölüm 2'yi tamamlayıp şunu çalıştır:"
  echo "      a2ensite $SITE && apache2ctl configtest && systemctl reload apache2"
else
  a2ensite -q "$SITE"
  apache2ctl configtest && systemctl reload apache2
  echo "==> Site vhost'u etkin."
fi

echo
echo "SIRADAKİ ADIMLAR:"
echo "  1) GitHub Actions genel anahtarını ekle:"
echo "       /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "  2) Host anahtarını al (GitHub secret SSH_KNOWN_HOSTS için):"
echo "       ssh-keyscan -t ed25519 <sunucu-ip>"
echo "  3) Cloudflare'de SSL/TLS modunu 'Full (strict)' yap ve"
echo "     Authenticated Origin Pulls'u aç."
echo
