# DEPLOY.md — GitHub → VPS (Apache2) yayın kurulumu

## Model

Derleme **GitHub Actions'ta** yapılır, sunucuya yalnızca hazır `dist/` gönderilir.

```
git push main
      │
      ▼
GitHub Actions          npm ci → astro build → dist/
      │                 (Node sadece burada var)
      │ rsync over SSH
      ▼
VPS  /var/www/deresys.com.tr/releases/<zaman>-<sha>/
      │ symlink swap (atomik, apache reload gerekmez)
      ▼
     current/  ←── Apache DocumentRoot
```

**Neden bu yön:** VPS'te ne Node, ne npm, ne de reponun kopyası bulunur.
Sunucuda GitHub kimlik bilgisi tutulmaz; bağlantı tek yönlüdür. Sunucu ele
geçirilse bile repoya yazma yetkisi elde edilemez. Sunucuda `git pull`
çalıştıran webhook modeli bunun tersini yapar ve bağımlılık kurulumunu
internete açık makineye taşır.

Symlink geçişinin Apache'de reload gerektirmediği test edildi: `current`
değiştiği anda yeni sürüm servis edilir.

---

## 1. Repo

```bash
cd deresys
git init && git branch -M main
git add . && git commit -m "İlk sürüm"
git remote add origin git@github.com:<kullanıcı>/deresys-web.git
git push -u origin main
```

Repo **private** olmalı. `.gitignore` `node_modules/` ve `dist/` içerir;
derlenmiş çıktı repoya girmez.

---

## 2. Sunucuyu hazırla

```bash
scp -r deploy/ root@<sunucu>:/tmp/
ssh root@<sunucu>
sudo bash /tmp/deploy/provision.sh
```

Betik şunları yapar:

| Ne | Nasıl |
|---|---|
| Apache modülleri | `headers rewrite ssl deflate http2 expires` |
| Varsayılan siteler | `000-default`, `default-ssl` kapatılır |
| `deploy` sistem kullanıcısı | parola kilitli, yalnızca SSH anahtarı |
| `/var/www` ağacı | aşağıdaki tabloya göre |
| conf + vhost kurulumu | `conf-available`, `sites-available` |
| ufw | yalnızca SSH + Apache Full |
| fail2ban, unattended-upgrades | etkin |
| Bakım sayfası | ilk `current` sürümü |

Betik SSH yapılandırmasına **dokunmaz** (bkz. bölüm 6).

### /var/www yapısı

```
/var/www/
├── _acme/                     755 root:www-data   ACME doğrulaması
├── _default/                  755 root:root       catch-all için boş kök
└── deresys.com.tr/            750 deploy:www-data
    ├── bin/activate.sh        750 deploy:www-data
    ├── releases/
    │   ├── 20260815T101500Z-a1b2c3d/
    │   └── 20260815T142200Z-e4f5g6h/
    ├── shared/                (form endpoint verisi için ayrıldı)
    └── current -> releases/20260815T142200Z-e4f5g6h
```

`750` + grup `www-data`: Apache okuyabilir, sunucudaki başka hiçbir kullanıcı
site köküne giremez. Dosyalar `644`, dizinler `755`; hiçbir web dosyası
yazılabilir değildir.

`current` bir symlink olduğu için vhost'ta `Options +FollowSymLinks` **zorunlu**.
`SymLinksIfOwnerMatch` kullanılmadı: her istekte ek `stat` çağrısı maliyeti var
ve kazanç yok, çünkü symlink de hedefi de `deploy` kullanıcısına ait.

---

## 3. SSH anahtarı

Anahtarı **kendi makinende** üret:

```bash
ssh-keygen -t ed25519 -C "github-actions-deresys" -f ./deploy_key -N ""
ssh root@<sunucu> "cat >> /home/deploy/.ssh/authorized_keys" < ./deploy_key.pub
```

---

## 4. GitHub secrets

`Settings → Secrets and variables → Actions`:

| Secret | Değer |
|---|---|
| `DEPLOY_SSH_KEY` | `deploy_key` dosyasının tamamı (private) |
| `DEPLOY_HOST` | `deresys.com.tr` veya sunucu IP'si |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_PORT` | SSH portu (varsayılan 22) |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan -t ed25519 <sunucu>` çıktısı |

`SSH_KNOWN_HOSTS` **zorunlu**. Workflow `StrictHostKeyChecking=yes` kullanır;
`no` yazmak deploy'u ortadaki adam saldırısına açar.

Secret'a ekledikten sonra yerel `deploy_key` dosyasını sil.

---

## 5. Sertifika

Site vhost'u sertifika dosyaları olmadan etkinleştirilemez
(`SSLCertificateFile` eksikse `configtest` başarısız olur). Sertifika da ACME
olmadan alınamaz. Bu kilitlenmeyi kırmak için **catch-all vhost 80 portunda
ACME yolunu servis eder** — `provision.sh` bunu hazır kurar.

```bash
# provision.sh sonrası site vhost'u HENÜZ etkin değil
systemctl reload apache2

certbot certonly --webroot -w /var/www/_acme \
  -d deresys.com.tr -d www.deresys.com.tr

a2ensite deresys.com.tr
apache2ctl configtest && systemctl reload apache2
```

Yenileme certbot'un systemd timer'ı ile otomatiktir:

```bash
systemctl list-timers | grep certbot
certbot renew --dry-run
```

Yenileme sonrası Apache'nin sertifikayı yeniden okuması için deploy hook:

```bash
echo -e '#!/bin/sh\nsystemctl reload apache2' \
  > /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-apache.sh
```

---

## 6. SSH sertleştirme (manuel)

**İkinci bir oturum açıkken** yap; kilitlenirsen geri dönebilesin.

`/etc/ssh/sshd_config.d/99-hardening.conf`:

```
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
X11Forwarding no
AllowAgentForwarding no
MaxAuthTries 3
ClientAliveInterval 300
AllowUsers <kendi-kullanıcın> deploy
```

```bash
sshd -t && systemctl reload ssh
```

---

## 7. Yayın ve geri alma

```bash
git push origin main
```

Actions sırayla: kurar → derler → **satır içi script/style kontrolü** →
rsync → symlink swap → `https://deresys.com.tr/` 200 mü diye doğrular.

Geri alma:

```bash
ssh deploy@<sunucu>
ls -1t /var/www/deresys.com.tr/releases/
/var/www/deresys.com.tr/bin/activate.sh <önceki-sürüm>
```

Saniyeler sürer, yeniden derleme ve Apache reload gerekmez. Son 5 sürüm saklanır.

---

## 8. Apache'ye özgü notlar

**`security.conf` bizim ayarlarımızı eziyordu.** Ubuntu'nun
`conf-available/security.conf` dosyası `ServerTokens OS` ve
`ServerSignature On` tanımlar. `conf-enabled` alfabetik yüklenir ve son okunan
kazanır; `deresys-hardening` < `security` olduğu için bizim değerlerimiz
geçersiz kalıyordu — test sırasında `Server: Apache/2.4.58 (Ubuntu)` başlığı
sızıyordu. `provision.sh` artık `security.conf` dosyasının kendisini
sertleştiriyor (yedeği `.deresys.bak` olarak alınır). Doğrulanmış sonuç:
`Server: Apache`.

**Başlık mirası nginx'ten farklı.** Apache `Header` direktiflerini alt
bağlamlara miras bırakır. nginx'te bir `location` içindeki `add_header` üst
bloktakileri siler ve güvenlik başlıklarını her blokta tekrar eklemek gerekir;
Apache'de bir kez tanımlamak yeterli. Bu yüzden `deresys-security.conf` tek
yerde duruyor.

**Catch-all'da TLS el sıkışması reddedilemiyor.** nginx'in
`ssl_reject_handshake` karşılığı Apache'de yok. Catch-all `*:443` vhost'u
snakeoil sertifikasıyla el sıkışmayı tamamlayıp `403` döner. Sonuç aynı:
IP üzerinden veya yanlış `Host` başlığıyla gelen istek site içeriğine ulaşamaz.

**HTTP/2 için mpm_event gerekiyor.** `mpm_prefork` etkinse (genellikle
`mod_php` yüzünden) HTTP/2 çalışmaz. `provision.sh` bunu tespit edip uyarır.
Test sunucusunda protokol `h2` olarak doğrulandı.

**KVKK: erişim kaydında IP maskeleniyor.** Apache'de nginx'teki `map` yok;
`SetEnvIf` geri referanslarıyla yapıldı. IPv4'ün son okteti, IPv6'nın ilk iki
bloğu dışındaki kısım atılır. Test: `127.0.0.1` → `127.0.0.0` olarak kaydedildi,
logda tam IP bulunmadı. Saldırı analizi için tam IP gerekiyorsa bunu bilinçli
olarak geri al ve saklama süresi belirle.

**CSP `unsafe-inline` içermiyor.** Astro `inlineStylesheets: 'never'` ve
`assetsInlineLimit: 0` ile yapılandırıldı. Bu ayarlar geri alınırsa CSP siteyi
bozar — workflow bunu derlemede yakalar.

---

## 9. Yayın sonrası kontrol listesi

```bash
curl -sI https://deresys.com.tr | grep -iE "strict-transport|content-security|x-content-type|referrer|permissions|^server"
curl -sI http://deresys.com.tr | head -1                    # 301
curl -sI https://deresys.com.tr -H "Host: rastgele.test"    # 403
curl -so /dev/null -w '%{http_code}\n' https://deresys.com.tr/.git/config   # 403
apache2ctl configtest
tail -2 /var/log/apache2/deresys.access.log                 # IP maskeli mi
```

Dışarıdan doğrulama: SSL Labs ve securityheaders.com.

**Sonraki iş:** Umami ve form endpoint'i eklendiğinde CSP gözden geçirilmeli.
Umami aynı origin'de kalırsa değişiklik gerekmez; alt alan adına kurulursa
`script-src` ve `connect-src` genişletilmeli. Form endpoint'i için Apache'de
hız sınırı `mod_ratelimit` ile yapılamaz (o bant genişliği sınırlar);
`mod_qos` veya fail2ban filtresi gerekir.
