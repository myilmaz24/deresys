# KURULUM.md — Sıfırdan temiz kurulum

Baştan sona tek liste. Her bölümün sonunda bir **kontrol** var; geçmeden
devam etme, yoksa hata bir sonraki adımda karşına çıkar ve nedenini bulmak
zorlaşır.

Sunucu: `94.138.221.12` · Alan adı: `deresys.com.tr`

---

## A. Yerel depoyu düzelt

Depon `D:\Deresys\web\deployment\deresys-site`. İçindeki `deploy` klasörü
eski (Let's Encrypt) sürüm olabilir; önce onu tazeleyeceğiz.

**A1.** `deresys-kurulum.zip` dosyasını indir. Çift tıklama —
sağ tık → **Tümünü ayıkla** → hedef `D:\Deresys\web\gecici`.

**A2.** Depoya kopyala:

```powershell
cd D:\Deresys\web\deployment\deresys-site
robocopy "D:\Deresys\web\gecici\deploy" ".\deploy" /E /PURGE
robocopy "D:\Deresys\web\gecici\.github" ".\.github" /E
```

`/PURGE` eski dosyaları siler. Olmazsa Let's Encrypt artıkları kalır.

**A3. Kontrol:**

```powershell
dir deploy
dir deploy\bin
Select-String -Path deploy\apache\*.conf -Pattern "letsencrypt"
```

Görmen gerekenler:
- `deploy` içinde: `apache`, `bin`, `DEPLOY.md`, `provision.sh`, `temizle.sh`
- `deploy\bin` içinde: `activate.sh`, `cloudflare-ips.sh`
- `Select-String` **hiçbir şey döndürmemeli**

Üçü de doğruysa devam. Değilse A1'i tekrarla.

**A4.** Depoya işle:

```powershell
git add .
git commit -m "Cloudflare yayın yapılandırması"
git push
```

---

## B. Cloudflare ayarları

Panelde `deresys.com.tr` → sırayla:

**B1. DNS** sekmesi:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `deresys.com.tr` | `94.138.221.12` | **Proxied** (turuncu) |
| A | `www` | `94.138.221.12` | **Proxied** (turuncu) |

**B2. SSL/TLS → Overview** → `Full (strict)`

**B3. SSL/TLS → Edge Certificates** → Always Use HTTPS **açık**,
Minimum TLS Version **1.2**

**B4. SSL/TLS → Origin Server → Authenticated Origin Pulls** → **açık**

**B5. Kontrol:**

```powershell
nslookup deresys.com.tr
```

Dönen IP `94.138.221.12` **olmamalı** — Cloudflare IP'si (104.x, 172.6x,
188.114.x) görmelisin. Kendi IP'ni görüyorsan bulut gri kalmış, B1'e dön.

---

## C. Origin Certificate

**C1.** Cloudflare → **SSL/TLS → Origin Server → Create Certificate** →
varsayılanları bırak → **Create**.

İki metin kutusu çıkar. **Sayfayı kapatma.**

**C2.** Sunucuda:

```bash
ssh root@94.138.221.12
mkdir -p /etc/ssl/cloudflare && chmod 700 /etc/ssl/cloudflare
nano /etc/ssl/cloudflare/deresys.com.tr.pem
```

Üstteki kutuyu (**Origin Certificate**) yapıştır → `Ctrl+O`, Enter, `Ctrl+X`.

```bash
nano /etc/ssl/cloudflare/deresys.com.tr.key
```

Alttaki kutuyu (**Private Key**) yapıştır → `Ctrl+O`, Enter, `Ctrl+X`.

```bash
chmod 644 /etc/ssl/cloudflare/deresys.com.tr.pem
chmod 600 /etc/ssl/cloudflare/deresys.com.tr.key
```

**C3. Kontrol:**

```bash
openssl x509 -noout -subject -issuer -dates -in /etc/ssl/cloudflare/deresys.com.tr.pem
openssl x509 -noout -modulus -in /etc/ssl/cloudflare/deresys.com.tr.pem | openssl md5
openssl rsa  -noout -modulus -in /etc/ssl/cloudflare/deresys.com.tr.key | openssl md5
```

Beklenen:
- `issuer=` satırında **CloudFlare Origin SSL Certificate Authority**
- İki `md5` çıktısı **birbirinin aynısı**

Farklıysa sertifika ve anahtar farklı çiftlerden — C1'e dön, yeni sertifika
üret ve iki kutuyu da aynı sayfadan al.

---

## D. Sunucuyu kur

**D1.** Dosyaları gönder (kendi bilgisayarından):

```powershell
cd D:\Deresys\web\deployment\deresys-site
ssh root@94.138.221.12 "rm -rf /tmp/deploy /opt/deresys"
scp -r deploy root@94.138.221.12:/tmp/
```

**D2.** Kalıcı kopya (`/tmp` yeniden başlatmada silinir):

```bash
ssh root@94.138.221.12
mkdir -p /opt/deresys && cp -r /tmp/deploy /opt/deresys/
```

**D3. Kontrol** — doğru sürüm mü:

```bash
grep -c letsencrypt /opt/deresys/deploy/apache/deresys.com.tr.conf
ls /opt/deresys/deploy/bin/
```

`0` ve iki dosya (`activate.sh`, `cloudflare-ips.sh`) görmelisin.
Görmüyorsan A bölümü eksik kalmış.

**D4.** Temizle, sonra kur:

```bash
sudo bash /opt/deresys/deploy/temizle.sh
sudo bash /opt/deresys/deploy/provision.sh
```

`temizle.sh` yarım kalmış denemeleri siler; sertifikaları, deploy
kullanıcısını ve yayınlanmış sürümleri korur. İkisi de tekrar
çalıştırılabilir.

**D5. Kontrol:**

```bash
sudo a2query -s
openssl s_client -connect 127.0.0.1:443 -servername deresys.com.tr </dev/null 2>&1 | grep -E "subject=|issuer=" | head -2
```

Beklenen:

```
deresys.com.tr (enabled by site administrator)
000-default-deny (enabled by site administrator)

subject=CN = deresys.com.tr
issuer=C = US, O = "CloudFlare, Inc.", OU = CloudFlare Origin SSL Certificate Authority
```

`issuer` satırında `ihscloud.net` görüyorsan vhost etkinleşmemiş demektir —
`provision.sh` çıktısındaki hata mesajına bak.

**D6. Kontrol** — tarayıcıda `https://deresys.com.tr`:

Siyah zeminde **"DERESYS — Yayına hazırlanıyor"** bakım sayfası görmelisin.
Buraya kadar geldiysen en zor kısım bitti.

Hata kodu görüyorsan:
- **526** → sertifika doğrulanamıyor. C3 kontrolüne dön.
- **525** → Authenticated Origin Pulls Cloudflare'de kapalı (B4).
- **521** → Apache çalışmıyor ya da ufw 443'ü açmamış.
  `systemctl status apache2` ve `sudo ufw status | head`.

---

## E. Deploy anahtarı

Bu, bilgisayarını GitHub'a bağlayan anahtardan **farklı**. GitHub Actions'ın
sunucuna girebilmesi için.

**E1.** Üret (proje klasörünün dışında):

```powershell
cd $env:USERPROFILE\Desktop
ssh-keygen -t ed25519 -C "github-actions-deresys" -f .\deploy_key -N '""'
scp .\deploy_key.pub root@94.138.221.12:/tmp/
```

**E2.** Sunucuya ekle:

```bash
ssh root@94.138.221.12
tr -d '\r' < /tmp/deploy_key.pub >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
rm /tmp/deploy_key.pub
exit
```

`tr -d '\r'` şart — Windows'un görünmez satır sonu karakteri anahtarı bozar.

**E3. Kontrol** — GitHub'a koymadan önce kendin dene:

```powershell
ssh -i .\deploy_key deploy@94.138.221.12 "echo OK; ls /var/www/deresys.com.tr/"
```

`OK` ve `bin current releases shared` görmelisin. `Permission denied`
alıyorsan E2'de bir şey ters gitmiş.

**E4.** Host anahtarını al — `ssh-keyscan` Windows'ta çalışmıyor, sunucudan
okuyoruz:

```bash
ssh root@94.138.221.12 'awk "{print \"94.138.221.12 \" \$1 \" \" \$2}" /etc/ssh/ssh_host_ed25519_key.pub'
```

Çıkan tek satırı kopyala.

---

## F. GitHub secrets

Repo → **Settings → Secrets and variables → Actions** → **New repository secret**.
Beş tane:

| Name | Değer |
|---|---|
| `DEPLOY_SSH_KEY` | `deploy_key` dosyasının tamamı — `Get-Content -Raw .\deploy_key \| Set-Clipboard` |
| `DEPLOY_HOST` | `94.138.221.12` |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_PORT` | `22` |
| `SSH_KNOWN_HOSTS` | E4'teki satır |

İki nokta:
- `DEPLOY_SSH_KEY` → `.pub` **olmayan** dosya. İçeriği
  `-----BEGIN OPENSSH PRIVATE KEY-----` ile başlamalı.
- `DEPLOY_HOST` → **IP**, alan adı değil. Cloudflare SSH'ı geçirmez.

Bitince yerel anahtarları sil:

```powershell
Remove-Item .\deploy_key, .\deploy_key.pub
```

---

## G. Yayına al

GitHub → **Actions** → en üstteki çalışma → **Re-run all jobs**.

~2 dakika. Adımlar: kur → derle → satır içi kontrolü → SSH → rsync →
symlink → doğrula.

**Kontrol:** İş yeşil ve `https://deresys.com.tr` gerçek siteyi gösteriyor.

---

## Bundan sonra

```powershell
cd D:\Deresys\web\deployment\deresys-site
git add .
git commit -m "Ne değiştirdiğini yaz"
git push
```

Push'tan 1–2 dakika sonra site güncellenir.

**Geri alma** (yeniden derleme gerekmez):

```bash
ssh deploy@94.138.221.12
ls -1t /var/www/deresys.com.tr/releases/
/var/www/deresys.com.tr/bin/activate.sh <önceki-sürüm-adı>
```

**Siteyi yerelde çalıştırma:**

```powershell
npm install
npm run dev
```
