---
title: "HOOKEDGE: BlueDelta'nın (APT28) Yeni Arka Kapısı — Teknik Analiz ve Purple Team Doğrulaması"
description: "Recorded Future'ın açığa çıkardığı, C2 ve veri sızdırma için Microsoft Edge ile webhook.site'i kullanan HOOKEDGE arka kapısının analizi; tespit mantığını kendi Caldera/Splunk laboratuvarımızda uçtan uca doğrulamamızın kaydı."
pubDate: 2026-09-03
author: "DERESYS"
tags: ["Tehdit İstihbaratı", "Tespit Mühendisliği"]
image: "/blog/apt28-ttp-emulasyonu-caldera-splunk/cover.png"
imageAlt: "Bir uç noktadan dışarıya uzanan, tespit noktalarıyla işaretlenmiş turuncu bir saldırı zinciri grafiği"
---

Recorded Future'ın Insikt Group birimi, Ağustos 2026'da Rusya bağlantılı BlueDelta grubuna (kamuoyunda APT28, Fancy Bear, Forest Blizzard adlarıyla da anılıyor) atfedilen, daha önce belgelenmemiş bir arka kapıyı raporladı: HOOKEDGE. Bizim için ilgi çekici tarafı sadece yeni bir arka kapı olması değil — komuta-kontrol ve veri sızdırma için özel bir sunucu yerine webhook.site ile Microsoft Edge'i kullanması, ve hedef listesinde Türkiye'nin de yer alması. Aşağıda kampanyanın teknik özetini, önerilen tespit mantığını ve bu mantığı kendi laboratuvarımızda gerçekten çalıştırıp çalıştırmadığını doğruladığımız purple team turunu paylaşıyoruz.

## Özet

- HOOKEDGE, Eylül 2025 sonu ile Nisan 2026 başı arasında aktif olarak kullanılan, hafif bir Windows batch script arka kapısıdır.
- Insikt Group, grubu "orta düzey güvenle" BlueDelta'ya (APT28) atfediyor; dayanak, grubun önceki arka kapısı HEADLACE (Nisan 2023'ten beri biliniyor) ile kod ve TTP örtüşmesi.
- Hedefler: Romanya, İspanya ve Türkiye'deki devlet kurumları, diplomatik misyonlar ve savunma sanayii şirketleri.
- Ayırt edici özellik: klasik bir C2 sunucusu yerine webhook.site ve gizli/headless Microsoft Edge süreçleri kullanılıyor — kötü amaçlı trafik sıradan tarayıcı aktivitesine benziyor.
- Bu yazının ikinci yarısında, aynı davranış zincirini MITRE Caldera'da güvenle simüle edip önerilen tespit mantığının Splunk'ta gerçekten alarm ürettiğini doğruladık: dört teknik, dört alarm.

## Kim bu: BlueDelta (APT28)

BlueDelta, Rusya Genelkurmay Başkanlığı'na bağlı GRU askeri istihbarat teşkilatıyla ilişkilendirilen, on yılı aşkın süredir devlet, diplomasi, savunma sanayii ve politika odaklı kuruluşlara yönelik casusluk faaliyetleri yürüten bir gruptur. Bu isim Recorded Future'ın kendi adlandırması olup, kamuoyunda daha çok APT28, Fancy Bear veya Microsoft'un adlandırmasıyla Forest Blizzard olarak biliniyor.

Insikt Group'un attribütion dayanağı şöyle: HOOKEDGE ile grubun Nisan 2023'ten beri diplomatlara yönelik saldırılarda kullandığı modüler Windows arka kapısı HEADLACE arasında önemli kod ve TTP örtüşmesi (aynı JavaScript payload mimarisi, değişken adlandırma kalıpları, base64 kodlama şeması) tespit edilmiş. Bu, kesin değil "orta düzey" bir güven derecesi — okurken bu ayrımı korumakta fayda var.

## HOOKEDGE nedir

HOOKEDGE, özel bir C2 sunucusuna ihtiyaç duymadan, komutları webhook.site üzerinden alıp yine webhook.site üzerinden sonuç döndüren, hafif bir Windows batch script arka kapısıdır. Kampanya Romanya, İspanya ve Türkiye'deki devlet kurumlarını, diplomatik misyonları ve savunma sanayii şirketlerini hedef almış. Türkiye'nin hedef listesinde olması, bölgesel SOC ekipleri için bunu doğrudan ilgi alanına sokuyor.

### İlk erişim

Saldırı, hedefli oltalama (spearphishing) e-postaları yoluyla dağıtılan makro içeren Word belgeleriyle başlıyor. İlk gözlemlenen örnekler İspanya Başbakanlığı, Adalet ve Kortes İlişkileri Bakanlığı'na ait belgeleri taklit eden diplomatik temalı tuzaklardı; zamanlama İspanya-Moldova görüşmeleri ve Moldova seçimleriyle örtüşecek şekilde seçilmişti. Sonraki dalgalarda tuzaklar daha jenerik "İçeriği Etkinleştir" istemlerine sadeleşti — muhtemelen ölçeklenebilirlik için.

### Kurulum ve kalıcılık

Makro etkinleştirildiğinde belge `%USERPROFILE%` dizinine altı dosya yazıyor (arka kapı, launcher, installer ve exfiltration için hazırlanmış HTML şablonları dahil). Bir installer launcher çalışıp HOOKEDGE'i düzenli aralıklarla yeniden tetikleyecek bir zamanlanmış görev oluşturuyor — standart varyantta 30 dakikada bir. Bazı varyantlarda bu aralık 61 dakikaya çıkarılmış; bunun nedeni büyük olasılıkla kasıtlı bir sanal alan (sandbox) kaçınma taktiği — otomatik kötü amaçlı yazılım analiz sistemleri örnekleri genellikle bir saatlik bir pencerede izliyor, 61 dakika bu pencerenin hemen dışına düşüyor. Kurulum tamamlandıktan sonra ana bileşen kendisini, launcher'ı ve görev tanım dosyasını dizinden siliyor; adli analiz ayak izini azaltmaya yönelik bilinçli bir davranış.

Erken varyantlarda, belge açılır açılmaz operatörlere haber vermek üzere gizli bir görüntü referansı (`docopened.jpg` gibi bir isimle) bir webhook.site URL'sine bağlanıyordu. Sonraki dalgalarda bu "belge açılma" kanaryası kaldırıldı — muhtemelen ağ tabanlı bir göstergeyi daha azaltmak için.

### Komuta-kontrol: iki webhook, tek tarayıcı

HOOKEDGE'in en dikkat çekici yönü, C2 için iki ayrı webhook.site uç noktasını kullanması:

- **Komut alma:** Gizli (headless veya ekran dışı pencereyle) bir Edge süreci webhook.site'a bağlanıp payload indiriyor, birleştirip batch script olarak çalıştırıyor.
- **Veri sızdırma:** Komut çıktısı önceden hazırlanmış bir HTML dosyasına yazılıyor; ikinci bir gizli Edge süreci bu dosyayı açıp otomatik tetiklenen bir HTTP POST isteğiyle veriyi ayrı bir webhook.site uç noktasına gönderiyor.

Tüm altyapı webhook.site'in ücretsiz katmanına dayanıyor — bu katman uç nokta başına 100 istekle sınırlı. Insikt Group, BlueDelta'nın uç noktaları NordVPN IP adreslerinden yönettiğini gözlemlemiş.

### Kademeli operasyon modeli

Grup, yüksek değerli hedefler için beş dakikada bir haberleşen ikinci aşama bir HOOKEDGE payload'u devreye alıyor. Genel erişim için düşük frekanslı (30-61 dakika), seçilmiş istihbarat açısından değerli kurbanlar için yüksek frekanslı (5 dakika) bir yapı — bu ayrım aynı zamanda webhook.site'in sınırlı istek kotasını, ilk erişim altyapısı tükenmeden koruyor.

## Tespit yöntemleri

### Davranışsal göstergeler

| # | Gösterge | Açıklama |
|---|---|---|
| 1 | Office süreçlerinden `cmd.exe` / `wscript.exe` / `schtasks.exe` çağrısı | `WINWORD.EXE`'nin alt süreç olarak zamanlanmış görev oluşturması normal değildir |
| 2 | `msedge.exe` sürecinin gizli/görünmez pencere ile başlatılması | `--headless`, ekran dışı pencere konumu veya minimize argümanları |
| 3 | `msedge.exe` → webhook.site alan adına düzenli aralıklı bağlantılar | Beacon davranışı — periyodiklik anomalisi (30, 61 veya 5 dakika) |
| 4 | `%USERPROFILE%` altında oluşturulup kısa sürede silinen `.bat`/`.cmd`/`.html` dosyaları | Kurulum sonrası iz temizleme |
| 5 | Zamanlanmış görev oluşturulduktan hemen sonra görev tanım dosyasının silinmesi | Kalıcılık + adli analiz karşıtı kombinasyon |
| 6 | HTML dosyasından tetiklenen otomatik POST isteği | Tarayıcı trafiği görünümünde sızdırma |

### Örnek tespit mantığı (Sigma-benzeri)

```yaml
title: Şüpheli Office -> Scheduled Task -> Hidden Edge Zinciri
logsource:
  category: process_creation
  product: windows
detection:
  office_parent:
    ParentImage|endswith: '\WINWORD.EXE'
  suspicious_child:
    Image|endswith: ['\cmd.exe', '\schtasks.exe']
  hidden_edge:
    Image|endswith: '\msedge.exe'
    CommandLine|contains: ['--headless', '--window-position=-32000']
  condition: (office_parent and suspicious_child) or hidden_edge
level: high
```

Kural iki yoldan tetiklenebiliyor: Office'in doğrudan bir görev zamanlayıcı/kabuk süreci doğurması, ya da tek başına gizli pencereli bir Edge süreci. İkincisi tek başına daha düşük güvenilirlikli — headless tarayıcı otomasyonu meşru amaçlarla da (test, kazıma) kullanılabiliyor; bu yüzden ağ tabanlı göstergelerle birlikte değerlendirilmesi öneriliyor.

### Ağ tabanlı tespit

- webhook.site alan adına giden trafiğin, kurumsal envanterle eşleşmeyen iş istasyonlarından geldiği durumlar izlenmeli; tek başına bir uzlaşma göstergesi (IOC) değil, bağlamla değerlendirilmesi gereken bir sinyal.
- Proxy/DNS loglarında `msedge.exe` süreç ağacından webhook.site alt yollarına düzenli aralıklı istekler.
- E-posta ağ geçidinde, gövdesinde webhook.site referanslı gizli resim (tracking pixel) içeren `.docm`/`.doc` eklerinin taranması.

### Bilinen gösterge örnekleri (IOC — defanged)

| Tür | Gösterge | Amaç |
|---|---|---|
| Webhook URL | `hxxp://webhook[.]site/1e72b758-79e4-4c1c-90ed-7a8dc118f105` | C2 / staging |
| Doküman açılma kanaryası | `hxxp://webhook[.]site/62114596-33f5-47fb-9012-0223529e5a13/docopened[.]jpg` | Belge açılma takibi |

Bu göstergeler kampanyaya özgü örnekler ve zamanla değişiyor; asıl kalıcı değer yukarıdaki davranışsal tespit mantığında.

## Öneriler

**Önleme:** İnternetten indirilen Office belgelerinde makroları varsayılan olarak engelleyin (ASR kuralları: Office'in çocuk süreç oluşturmasını / Win32 API çağrısı yapmasını engelleme). webhook.site ve benzeri genel webhook servislerini kurumsal proxy/DNS katmanında, iş gereksinimi olmayan uç noktalar için engelleyin veya uyarı moduna alın. E-posta ağ geçidinde diplomatik/resmi temalı, dış kaynaklı `.docm` eklerine yönelik ek inceleme kuralları tanımlayın.

**Tespit ve izleme:** EDR'de Office süreçlerinin alt süreç oluşturmasını sınırlayan ve uyaran kurallar aktif olsun. `msedge.exe`'nin komut satırı argümanlarını (headless, ekran dışı pencere konumu) izleyen bir korelasyon kuralı ekleyin. Zamanlanmış görev oluşturma + kısa süre içinde görev tanım dosyasının silinmesi kombinasyonunu tespit eden bir use-case yazın.

**Müdahale ve sertleştirme:** Task Scheduler Operational ve Prefetch verilerini, dosyalar silinmeden önce toplayacak bir log forwarding/retention politikası uygulayın. Yüksek riskli personel için makro çalıştırma yetkisini tamamen kaldırmayı değerlendirin. Mevcut APT28/HEADLACE tespit kurallarınızı HOOKEDGE davranış kalıplarını da kapsayacak şekilde güncelleyin.

**İstihbarat paylaşımı:** Türkiye'yi doğrudan hedef alan bir kampanya olduğundan, gözlemlenen göstergeleri sektörel ISAC/CERT paylaşım kanallarına bildirin.

## Purple team doğrulaması

Bir tespit kuralının belgede yer alması ile sahada gerçekten tetiklenmesi aynı şey değil. Bunu görmenin bildiğimiz tek yolu, davranışı üretip kurala göndermek. Aşağıdaki bölüm, HOOKEDGE'in davranış zincirini (kalıcılık → gizli Edge ile C2 çekme → gizli Edge ile sızdırma → iz temizleme) gerçek zararlı kod kullanmadan MITRE Caldera üzerinde adversary emulation ile simüle edip, yukarıdaki tespit mantığının Splunk'ta gerçekten alarm ürettiğini uçtan uca doğruladığımız laboratuvar çalışmasıdır.

### Webhook.site üzerinden izleme

Test için iki ayrı webhook.site uç noktası (komut ve sızdırma rolü için) oluşturduk ve hedef makineden gelen istekleri canlı izledik. Gelen isteğin `user-agent` ve `sec-ch-ua` başlıklarında Microsoft Edge imzası (Chromium/Edge) görülmesi, isteğin gerçekten simüle edilen tarayıcı sürecinden geldiğini doğruluyor. (Aşağıdaki görüntüde, laboratuvar makinemizin genel IP adresi ve isteklerin listelendiği gelen kutusu paneli, gerçek altyapımızı ifşa etmemek için kırpıldı.)

![Webhook.site istek detayları: User-Agent ve sec-ch-ua başlıklarında Microsoft Edge imzası görülüyor](/blog/apt28-ttp-emulasyonu-caldera-splunk/webhook-site-izleme.png)

### Caldera'da ability tanımları

HOOKEDGE'in dört davranışsal adımını, ATT&CK teknikleriyle eşleştirerek Caldera "ability" formatında tanımladık: Scheduled Task Persistence (T1053.005), Hidden Edge C2 Pull (T1071.001), Hidden Edge Exfil POST (T1567) ve Cleanup Traces (T1070.004).

![Caldera Abilities ekranı: HOOKEDGE-Sim adı altında dört ability ve açıklamaları](/blog/apt28-ttp-emulasyonu-caldera-splunk/abilities-katalogu.png)

### Adversary profili

Dört ability'i, gerçek saldırı zincirindeki sırayla (persistence → command-and-control → exfiltration → defense-evasion) tek bir adversary profilinde birleştirdik.

![Caldera Adversaries ekranı: HOOKEDGE davranış zincirinin doğru sırayla tanımlanmış hali](/blog/apt28-ttp-emulasyonu-caldera-splunk/01-adversary-profili.png)

### Operasyonun çalıştırılması

Adversary profilini hedef Windows uç noktasındaki agent üzerinde, otonom modda çalıştırdık. Dört ability de sırayla tetiklendi ve dördü de başarıyla (success) tamamlandı.

![Caldera Operations ekranı: dört ability de success statüsüyle tamamlanmış](/blog/apt28-ttp-emulasyonu-caldera-splunk/02-operasyon-sonuclari.png)

### Splunk tespit sorgularının doğrulanması

Operasyon sırasında, yukarıdaki bölümde tanımlanan davranışsal göstergelerin her biri için ayrı SPL sorguları çalıştırarak ilgili event'lerin gerçekten üretildiğini doğruladık.

**Zamanlanmış görev oluşturma.** Windows Görev Zamanlayıcısı'nın operational logundaki 106 numaralı olay (yeni görev kaydı) 1 event yakaladı:

![Splunk'ta EventCode=106 üzerinden zamanlanmış görev kaydını gösteren arama](/blog/apt28-ttp-emulasyonu-caldera-splunk/03-zamanlanmis-gorev-aramasi.png)

**Gizli (headless) Edge süreci.** Sysmon'un 1 numaralı olayından (süreç oluşturma), `msedge.exe`'nin `--headless` ya da ekran dışı pencere konumuyla başlatılmasını arayan sorgu 8 event yakaladı:

![Sysmon EventCode=1 üzerinden msedge.exe'nin headless/gizli pencere bayraklarıyla başlatılmasını arayan Splunk sorgusu](/blog/apt28-ttp-emulasyonu-caldera-splunk/04-headless-edge-aramasi.png)

**Webhook.site bağlantısı.** Aynı sürecin ağ bağlantısını (Sysmon EventCode 3) hedef adı `webhook.site` olacak şekilde filtreleyen sorgu 3 event, 2 farklı grup yakaladı — komut alma ve veri sızdırma isteklerine karşılık gelen iki ayrı uç nokta:

![Sysmon EventCode=3 üzerinden msedge.exe'den webhook.site'e giden bağlantıyı arayan Splunk sorgusu](/blog/apt28-ttp-emulasyonu-caldera-splunk/05-webhook-baglanti-aramasi.png)

**Zincirlenmiş korelasyon.** Ayrı ayrı doğrulanan üç göstergeyi (headless Edge süreci + iki webhook.site bağlantı grubu) `tstats` ve `append` ile tek bir sorguda, host bazında birleştirerek tam saldırı zincirinin tek bir aramada tespit edilebilirliğini de doğrulandık:

![tstats ve Sysmon aramasını host bazında birleştiren zincirlenmiş APT28 korelasyon sorgusu](/blog/apt28-ttp-emulasyonu-caldera-splunk/06-korelasyon-aramasi.png)

### Sonuç: dört teknik, dört alarm

Yukarıdaki sorgular zamanlanmış alert olarak kaydedildikten sonra operasyonu yeniden çalıştırdık. Aynı operasyon penceresinde dört alarmın dördü de tetiklendi: Scheduled Task Oluşturuldu (High), Headless Edge (High), Webhook Bağlantı (High) ve zincirlenmiş APT28 keşif korelasyonu (Critical).

![Splunk'ta tetiklenen dört alarm kaydı: Scheduled Task Oluşturuldu, Headless Edge, Webhook Bağlantı, APT28 keşif](/blog/apt28-ttp-emulasyonu-caldera-splunk/07-tetiklenen-alarmlar.png)

Bu sonuç, makalenin tespit yöntemleri bölümünde tarif edilen mantığın teorik değil, gerçek ortamda çalışan bir kontrol olduğunu gösteriyor: dört davranışsal adımın dördü de kendi alarmına bağlı, korelasyon sorgusu da bunları tek bir yüksek-güvenilirlikli bulguda birleştiriyor.

## Sonuç

HOOKEDGE, C2 ve sızdırma için özel altyapı yerine webhook.site ve tarayıcı trafiğini kullanan, tespit açısından ilginç bir örnek — ama gösterdiği davranışlar (Office'ten şüpheli alt süreç, headless tarayıcı, periyodik webhook trafiği, kalıcılık+iz temizleme kombinasyonu) uzun süredir bilinen kalıplar. Recorded Future'ın önerdiği tespit mantığını kendi ortamımızda çalıştırıp doğruladık; aynı yöntem düzenli aralıklarla tekrarlanarak tespit kurallarının zaman içinde bozulup bozulmadığının (detection drift) izlenmesi için de kullanılabilir. Türkiye hedef listesinde yer aldığından, ilgili davranışsal göstergeleri kendi ortamınızda da kontrol etmenizi öneririz.

## Kaynaklar

- [Recorded Future / Insikt Group — "BlueDelta Targets Defense and Diplomacy with HOOKEDGE"](https://www.recordedfuture.com/research/bluedelta-targets-with-hookedge)
- [The Hacker News — "APT28-Linked HOOKEDGE Backdoor Targets European Government and Diplomatic Organizations"](https://thehackernews.com/2026/08/apt28-linked-hookedge-backdoor-targets.html)
- [Security Affairs — "Russian APT BlueDelta Uses HOOKEDGE to Target Defense and Diplomatic Organizations"](https://securityaffairs.com/197996/apt/russian-apt-bluedelta-uses-hookedge-to-target-defense-and-diplomatic-organizations.html)
- [Cyber Press — "APT28 HOOKEDGE Backdoor Abuses Microsoft Edge and webhook.site for C2 and Data Exfiltration"](https://cyberpress.org/apt28-hookedge-exploits-edge-webhooks/)
- [MITRE ATT&CK — APT28 (G0007)](https://attack.mitre.org/groups/G0007/)
