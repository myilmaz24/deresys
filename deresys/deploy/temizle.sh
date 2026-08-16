#!/usr/bin/env bash
#
# Yarım kalmış Deresys kurulumlarını temizler ve sunucuyu bilinen bir
# başlangıç noktasına döndürür. provision.sh'tan ÖNCE çalıştırılır.
#
#   sudo bash temizle.sh
#
# KORUNANLAR (silinmez):
#   - /etc/ssl/cloudflare/          sertifikalar
#   - deploy kullanıcısı ve SSH anahtarı
#   - /var/www/deresys.com.tr/      yayınlanmış sürümler
#
# SİLİNENLER: Apache yapılandırma artıkları, systemd timer, ufw kuralları.

set -euo pipefail

SITE="deresys.com.tr"
[[ $EUID -eq 0 ]] || { echo "root olarak çalıştırın: sudo bash $0" >&2; exit 1; }

echo "==> Site yapılandırmaları devre dışı"
a2dissite -q "$SITE" 000-default-deny 000-default default-ssl 2>/dev/null || true

echo "==> Eski vhost dosyaları siliniyor"
rm -f "/etc/apache2/sites-available/$SITE.conf"
rm -f /etc/apache2/sites-available/000-default-deny.conf
rm -f /etc/apache2/sites-enabled/*deresys* 2>/dev/null || true

echo "==> Deresys conf dosyaları siliniyor"
a2disconf -q deresys-hardening deresys-security deresys-cloudflare 2>/dev/null || true
rm -f /etc/apache2/conf-available/deresys-hardening.conf
rm -f /etc/apache2/conf-available/deresys-security.conf
rm -f /etc/apache2/conf-available/deresys-cloudflare.conf

echo "==> Ubuntu varsayılanları geri alınıyor"
if [[ -f /etc/apache2/ports.conf.deresys.bak ]]; then
  cp /etc/apache2/ports.conf.deresys.bak /etc/apache2/ports.conf
  echo "    ports.conf geri yüklendi"
fi
if [[ -f /etc/apache2/conf-available/security.conf.deresys.bak ]]; then
  cp /etc/apache2/conf-available/security.conf.deresys.bak /etc/apache2/conf-available/security.conf
  echo "    security.conf geri yüklendi"
fi

echo "==> systemd timer kaldırılıyor"
systemctl disable --now cloudflare-ips.timer >/dev/null 2>&1 || true
rm -f /etc/systemd/system/cloudflare-ips.timer /etc/systemd/system/cloudflare-ips.service
rm -f /usr/local/sbin/cloudflare-ips.sh
systemctl daemon-reload >/dev/null 2>&1 || true

echo "==> ufw Cloudflare kuralları temizleniyor"
while ufw status numbered 2>/dev/null | grep -q "cloudflare-443"; do
  n=$(ufw status numbered | grep "cloudflare-443" | grep -oE '^\[[ 0-9]+\]' | tr -d '[] ' | head -1)
  [[ -z "$n" ]] && break
  ufw --force delete "$n" >/dev/null
done

echo "==> Let's Encrypt artıkları"
if [[ -d /etc/letsencrypt/live/$SITE ]]; then
  echo "    /etc/letsencrypt/live/$SITE duruyor (Cloudflare kullanıldığı için gereksiz)"
  echo "    Silmek istersen: certbot delete --cert-name $SITE"
fi

echo "==> Apache yeniden başlatılıyor"
if apache2ctl configtest >/dev/null 2>&1; then
  systemctl restart apache2 >/dev/null 2>&1 || apache2ctl restart >/dev/null 2>&1 || true
  echo "    apache2 çalışıyor (varsayılan yapılandırma)"
else
  echo "    UYARI: configtest başarısız:"
  apache2ctl configtest
fi

echo
echo "==> Temizlik tamam. Durum:"
echo "    Etkin siteler:"
a2query -s 2>/dev/null | sed 's/^/      /' || echo "      (yok)"
echo "    Sertifikalar:"
ls -1 /etc/ssl/cloudflare/ 2>/dev/null | sed 's/^/      /' || echo "      YOK — kurmadan önce koyulmalı"
echo "    deploy kullanıcısı:"
id deploy >/dev/null 2>&1 && echo "      var" || echo "      yok (provision.sh oluşturacak)"
echo
echo "Sıradaki: sudo bash provision.sh"
