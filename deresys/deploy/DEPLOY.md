# DEPLOY.md — GitHub → VPS (Apache2, Cloudflare arkasında)

## Model

```
git push main
      │
      ▼
GitHub Actions          npm ci → astro build → dist/
      │ rsync over SSH
      ▼
VPS  /var/www/deresys.com.tr/releases/<zaman>-<sha>/
      │ symlink swap (atomik, apache reload gerekmez)
      ▼
     current/  ←── Apache, yalnızca 443, yalnızca Cloudflare'den
      │
      ▼
  Cloudflare  ←── ziyaretçi buraya bağlanır
```

Origin IP'si gizlidir. Tarayıcı Cloudflare'in sertifikasını görür; origin'deki
Cloudflare Origin Certificate 15 yıl geçerlidir ve yenileme gerektirmez.

---

## 1. Cloudflare'e alan adını taşı

1. Cloudflare'de hesap aç → **Add a site** → `deresys.com.tr` → Free plan.
2. Cloudflare mevcut DNS kayıtlarını tarar. Listeyi kontrol et.
3. Cloudflare iki **nameserver** verir. Alan adını aldığın yerden
   (`.com.tr` için kayıt operatörünün paneli) nameserver'ları bunlarla değiştir.
4. Yayılma birkaç saat sürebilir. Cloudflare panelinde alan adı **Active**
   olana kadar bekle.

### DNS kayıtları

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `deresys.com.tr` | `<sunucu-ip>` | **Proxied** (turuncu bulut) |
| A | `www` | `<sunucu-ip>` | **Proxied** (turuncu bulut) |

Turuncu bulut kapalıysa (gri) trafik Cloudflare'e uğramaz, origin IP'n açığa
çıkar ve Authenticated Origin Pulls yüzünden site çalışmaz. İkisi de turuncu olmalı.

---

## 2. Origin Certificate üret

Cloudflare panelinde **SSL/TLS → Origin Server → Create Certificate**.
Varsayılanları bırak (RSA 2048, 15 yıl), hostname listesinde
`deresys.com.tr` ve `*.deresys.com.tr` olsun.

İki metin kutusu çıkar. **Sayfayı kapatmadan** ikisini de sunucuya kaydet:

```bash
ssh root@<sunucu-ip>
mkdir -p /etc/ssl/cloudflare && chmod 700 /etc/ssl/cloudflare

nano /etc/ssl/cloudflare/deresys.com.tr.pem   # "Origin Certificate" kutusu
nano /etc/ssl/cloudflare/deresys.com.tr.key   # "Private Key" kutusu

chmod 644 /etc/ssl/cloudflare/deresys.com.tr.pem
chmod 600 /etc/ssl/cloudflare/deresys.com.tr.key
```

Private key bir daha gösterilmez. Kaybedersen yeni sertifika üretmen gerekir.

### Cloudflare SSL ayarları

**SSL/TLS → Overview → Full (strict)** seç. Bu şart.

- *Flexible*: Cloudflare ile origin arası şifresiz olur. Kullanma.
- *Full*: şifreli ama sertifika doğrulanmaz.
- *Full (strict)*: şifreli ve doğrulanır. Origin Certificate tam bunun için var.

Sonra **SSL/TLS → Edge Certificates**:

- **Always Use HTTPS**: açık. Origin 80'i hiç dinlemiyor, yönlendirmeyi uç yapar.
- **Minimum TLS Version**: 1.2
- **Automatic HTTPS Rewrites**: açık

**SSL/TLS → Origin Server → Authenticated Origin Pulls**: açık.
Bu, origin'e yalnızca Cloudflare'in bağlanabilmesini sağlar — IP listesi
güncellenmemiş olsa bile.

---

## 3. Sunucuyu hazırla

```powershell
scp -r .\deploy root@<sunucu-ip>:/tmp/
ssh root@<sunucu-ip>
```

```bash
sudo bash /tmp/deploy/provision.sh
```

Betik şunları yapar:

| Ne | Nasıl |
|---|---|
| Apache modülleri | `headers rewrite ssl deflate http2 expires remoteip` |
| `deploy` sistem kullanıcısı | parola kilitli, yalnızca SSH anahtarı |
| `/var/www` ağacı | aşağıdaki tabloya göre |
| Cloudflare istemci CA'sı | `origin-pull-ca.pem` indirilir |
| Cloudflare IP listesi | `mod_remoteip` + `ufw` kuralları, haftalık systemd timer |
| Port 80 | `Listen 80` devre dışı, ufw'de kapalı |
| Port 443 | yalnızca Cloudflare aralıklarına açık |
| fail2ban, unattended-upgrades | etkin |
| Bakım sayfası | ilk `current` sürümü |

Sertifika dosyaları yerindeyse betik site vhost'unu kendisi etkinleştirir.

### /var/www yapısı

```
/var/www/
├── _default/                  755 root:root       catch-all için boş kök
└── deresys.com.tr/            750 deploy:www-data
    ├── bin/activate.sh        750 deploy:www-data
    ├── releases/
    │   ├── 20260815T101500Z-a1b2c3d/
    │   └── 20260815T142200Z-e4f5g6h/
    ├── shared/                (form endpoint verisi için ayrıldı)
    └── current -> releases/20260815T142200Z-e4f5g6h
```

`750` + grup `www-data`: Apache okuyabilir, başka hiçbir kullanıcı giremez.
Dosyalar `644`, dizinler `755`; hiçbir web dosyası yazılabilir değildir.

---

## 4. Deploy anahtarı (ikinci SSH anahtarı)

Bu, bilgisayarını GitHub'a bağlayan anahtardan **farklı**. Proje klasörünün
dışında üret:

```powershell
cd $env:USERPROFILE\Desktop
ssh-keygen -t ed25519 -C "github-actions-deresys" -f .\deploy_key -N '""'
scp .\deploy_key.pub root@<sunucu-ip>:/tmp/
```

Sunucuda — `tr -d '\r'` önemli, Windows'tan gelen CRLF `authorized_keys`'i bozar:

```bash
tr -d '\r' < /tmp/deploy_key.pub >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
rm /tmp/deploy_key.pub
```

**Önemli:** SSH portu (22) Cloudflare üzerinden geçmez. `DEPLOY_HOST` olarak
alan adını yazarsan Cloudflare proxy'si SSH'ı geçirmez ve deploy başarısız olur.
**Sunucunun IP adresini kullan.**

---

## 5. GitHub secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | Değer |
|---|---|
| `DEPLOY_SSH_KEY` | `deploy_key` dosyasının tamamı (private) |
| `DEPLOY_HOST` | **sunucu IP'si** — alan adı değil |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_PORT` | `22` |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan -t ed25519 <sunucu-ip>` çıktısı |
| `CF_ZONE_ID` | opsiyonel — Cloudflare Overview sayfasının sağ altında |
| `CF_API_TOKEN` | opsiyonel — aşağıya bak |

`SSH_KNOWN_HOSTS` zorunlu. Workflow `StrictHostKeyChecking=yes` kullanır;
`no` yazmak deploy'u ortadaki adam saldırısına açar.

Girdikten sonra yerel anahtar dosyalarını sil:

```powershell
Remove-Item .\deploy_key, .\deploy_key.pub
```

### Cloudflare önbellek temizleme (opsiyonel)

HTML zaten `no-cache` ile servis edildiği ve varlıklar hash'li olduğu için
normalde gerekmez. "Cache Everything" kuralı eklersen gerekir.

Cloudflare → **My Profile → API Tokens → Create Token → Custom**:
izin olarak yalnızca `Zone → Cache Purge → Purge`, kapsam olarak tek zone.
Token'ı `CF_API_TOKEN` secret'ına koy. Secret boşsa workflow o adımı atlar.

---

## 6. Yayına al

Repo → **Actions** → son çalışmaya tıkla → **Re-run all jobs**.

Ya da:

```powershell
git commit --allow-empty -m "Yayın tetikle"
git push
```

İş yeşile döndüğünde `https://deresys.com.tr` canlıdır.

---

## 7. Geri alma

```bash
ssh deploy@<sunucu-ip>
ls -1t /var/www/deresys.com.tr/releases/
/var/www/deresys.com.tr/bin/activate.sh <önceki-sürüm-adı>
```

Saniyeler sürer; yeniden derleme ve Apache reload gerekmez. Son 5 sürüm saklanır.

---

## 8. Cloudflare arkasında olmanın getirdikleri

**Origin yalnızca Cloudflare'i kabul ediyor — iki katman.**
`cloudflare-ips.sh` Cloudflare aralıklarını çekip ufw'de 443'ü sadece onlara
açar; ayrıca Authenticated Origin Pulls ile Apache istemci sertifikası ister.
IP listesi bir hafta eskiyse bile ikinci katman devrede kalır.
Test edildi: sertifikasız doğrudan bağlantı reddedildi, sertifikalıysa 200.

**Gerçek ziyaretçi IP'si doğru okunuyor ve maskeleniyor.**
`mod_remoteip`, `CF-Connecting-IP` başlığını yalnızca Cloudflare aralıklarından
gelen bağlantılarda dikkate alır. KVKK maskelemesi bu değerin üzerine uygulanır.
Test edildi: güvenilir kaynaktan `203.0.113.45` → logda `203.0.113.0`;
güvenilmeyen kaynaktan aynı başlık **yok sayıldı**, yani taklit çalışmıyor.

**Port 80 origin'de hiç dinlenmiyor.** `Listen 80` devre dışı ve ufw'de kapalı.
Yönlendirmeyi Cloudflare "Always Use HTTPS" ile uçta yapar. Bunun bir yan
faydası var: SSL/TLS modunu yanlışlıkla "Flexible"a alırsan site sessizce
şifresiz çalışmaz, görünür şekilde bozulur.

**`security.conf` bizim ayarlarımızı eziyordu.** Ubuntu'nun
`conf-available/security.conf` dosyası `ServerTokens OS` tanımlar ve
`conf-enabled` alfabetik yüklendiği için bizimkinden sonra gelip eziyordu.
Test sırasında `Server: Apache/2.4.58 (Ubuntu)` sızdı. `provision.sh` artık
kaynağı düzeltiyor. Doğrulanmış sonuç: `Server: Apache`.

**Başlık mirası nginx'ten farklı.** Apache `Header` direktiflerini alt
bağlamlara miras bırakır; nginx'te her `location` içinde tekrarlamak gerekiyordu.

**HTTP/2 için mpm_event gerekiyor.** `mpm_prefork` etkinse (genellikle
`mod_php` yüzünden) HTTP/2 çalışmaz; `provision.sh` tespit edip uyarır.

**CSP `unsafe-inline` içermiyor.** Astro `inlineStylesheets: 'never'` ve
`assetsInlineLimit: 0` ile yapılandırıldı; workflow bunu derlemede denetler.

---

## 9. Kontrol listesi

Kendi bilgisayarından:

```bash
curl -sI https://deresys.com.tr | grep -iE "strict-transport|content-security|^server|^cf-"
curl -sI http://deresys.com.tr | head -1                     # CF 301 döner
```

Sunucudan:

```bash
apache2ctl configtest
systemctl status cloudflare-ips.timer --no-pager
tail -2 /var/log/apache2/deresys.access.log                  # IP maskeli mi
ss -lntp | grep -E ":80 |:443 "                              # 80 görünmemeli
```

Origin IP'sinin gerçekten kapalı olduğunu doğrula — başka bir ağdan:

```bash
curl -k --max-time 5 https://<sunucu-ip>/     # bağlanmamalı
```

D�şarıdan doğrulama: SSL Labs ve securityheaders.com.

**Sonraki iş:** Umami ve form endpoint'i eklendiğinde CSP gözden geçirilmeli.
Hız sınırı için Cloudflare Rate Limiting kullan — uçta durdurmak origin'e kadar
getirmekten iyidir.
