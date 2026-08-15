#!/usr/bin/env bash
#
# /var/www yapısını ve Apache2 yapılandırmasını kurar.
# Ubuntu/Debian, root olarak çalıştırılır. Tekrar çalıştırılabilir (idempotent).
#
#   sudo bash provision.sh
#
# SSH sertleştirmesi bu betikte YAPILMAZ — yanlış bir adım oturumu kesebilir.
# Adımlar DEPLOY.md'de manuel olarak listelenmiştir.

set -euo pipefail

SITE="deresys.com.tr"
DEPLOY_USER="deploy"
WEB_GROUP="www-data"
WWW="/var/www"
SITE_ROOT="$WWW/$SITE"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ $EUID -eq 0 ]] || { echo "root olarak çalıştırın: sudo bash $0" >&2; exit 1; }

echo "==> Paketler"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq apache2 ssl-cert rsync ufw fail2ban unattended-upgrades \
                       certbot python3-certbot-apache

echo "==> Apache modülleri"
a2enmod -q headers rewrite ssl deflate http2 expires
# Ubuntu varsayılan siteleri kaldırılır; yerine catch-all deny gelir
a2dissite -q 000-default default-ssl 2>/dev/null || true

# HTTP/2 yalnızca mpm_event/mpm_worker ile çalışır. mpm_prefork etkinse
# (genellikle mod_php yüzünden) HTTP/2 devre dışı kalır.
if apache2ctl -M 2>/dev/null | grep -q mpm_prefork; then
  echo "    UYARI: mpm_prefork etkin — HTTP/2 çalışmaz."
  echo "           Sunucuda PHP yoksa: a2dismod php8.3 mpm_prefork && a2enmod mpm_event"
fi

echo "==> Deploy kullanıcısı"
if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  # Sistem kullanıcısı: parola yok, yalnızca SSH anahtarıyla girilir
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
# /var/www kökü: root'a ait, herkes okuyabilir, kimse yazamaz
install -d -m 755 -o root -g root "$WWW"

# ACME webroot — certbot yazar, apache okur
install -d -m 755 -o root -g "$WEB_GROUP" "$WWW/_acme"
install -d -m 755 -o root -g "$WEB_GROUP" "$WWW/_acme/.well-known"
install -d -m 755 -o root -g "$WEB_GROUP" "$WWW/_acme/.well-known/acme-challenge"

# Catch-all sunucu için boş kök
install -d -m 755 -o root -g root "$WWW/_default"

# Site kökü — deploy yazar, www-data okur, diğerleri göremez
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

echo "==> Apache yapılandırması"
install -m 644 "$HERE/apache/deresys-hardening.conf" /etc/apache2/conf-available/deresys-hardening.conf
install -m 644 "$HERE/apache/deresys-security.conf"  /etc/apache2/conf-available/deresys-security.conf
install -m 644 "$HERE/apache/000-default-deny.conf"  /etc/apache2/sites-available/000-default-deny.conf
install -m 644 "$HERE/apache/$SITE.conf"             /etc/apache2/sites-available/$SITE.conf

a2enconf -q deresys-hardening deresys-security
a2ensite -q 000-default-deny

# Ubuntu'nun security.conf'u ServerTokens/ServerSignature/TraceEnable tanımlar.
# conf-enabled alfabetik yüklenir ve son okunan kazanır; "deresys-hardening"
# alfabetik olarak "security"den önce geldiği için bizim değerlerimiz EZİLİR.
# Bu yüzden varsayılan dosyanın kendisi sertleştirilir.
if [[ -f /etc/apache2/conf-available/security.conf ]]; then
  [[ -f /etc/apache2/conf-available/security.conf.deresys.bak ]] || \
    cp /etc/apache2/conf-available/security.conf /etc/apache2/conf-available/security.conf.deresys.bak
  sed -i -E 's|^[[:space:]]*ServerTokens .*|ServerTokens Prod|'      /etc/apache2/conf-available/security.conf
  sed -i -E 's|^[[:space:]]*ServerSignature .*|ServerSignature Off|' /etc/apache2/conf-available/security.conf
  sed -i -E 's|^[[:space:]]*TraceEnable .*|TraceEnable Off|'         /etc/apache2/conf-available/security.conf
  echo "    security.conf değerleri sertleştirildi"
fi

echo "==> Güvenlik duvarı"
ufw allow OpenSSH >/dev/null
ufw allow 'Apache Full' >/dev/null
if ! ufw status | grep -q "Status: active"; then
  echo "    ufw etkinleştiriliyor (SSH zaten izinli)"
  ufw --force enable >/dev/null
fi

echo "==> Otomatik güvenlik güncellemeleri"
dpkg-reconfigure -f noninteractive unattended-upgrades >/dev/null 2>&1 || true
systemctl enable --now fail2ban >/dev/null 2>&1 || true

echo "==> Yapılandırma testi"
apache2ctl configtest

echo
echo "==> Kurulum tamam."
echo
echo "SIRADAKİ ADIMLAR (sertifika olmadan site vhost'u etkinleştirilemez):"
echo
echo "  1) DNS: $SITE ve www.$SITE A/AAAA kayıtları bu sunucuya."
echo
echo "  2) Sertifikayı al (catch-all vhost 80 portunda ACME'yi karşılar):"
echo "       systemctl reload apache2"
echo "       certbot certonly --webroot -w $WWW/_acme -d $SITE -d www.$SITE"
echo
echo "  3) Site vhost'unu etkinleştir:"
echo "       a2ensite $SITE"
echo "       apache2ctl configtest && systemctl reload apache2"
echo
echo "  4) GitHub Actions genel anahtarını ekle:"
echo "       /home/$DEPLOY_USER/.ssh/authorized_keys"
echo
echo "  5) Host anahtarını al (GitHub secret SSH_KNOWN_HOSTS için):"
echo "       ssh-keyscan -t ed25519 $SITE"
echo
