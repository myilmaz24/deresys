---
title: "HOOKEDGE Laboratuvarı: Caldera ile APT28 TTP Emülasyonu ve Splunk Tespiti"
description: "MITRE Caldera'da APT28 ile ilişkilendirilen tekniklerden esinlenen dört adımlık bir zinciri kurup Splunk'ta tek tek ve korelasyonla nasıl yakaladığımızın kaydı — kapatamadığımız adım dahil."
pubDate: 2026-09-03
author: "DERESYS"
tags: ["Tespit Mühendisliği"]
image: "/blog/apt28-ttp-emulasyonu-caldera-splunk/cover.png"
imageAlt: "Bir uç noktadan dışarıya uzanan, tespit noktalarıyla işaretlenmiş turuncu bir saldırı zinciri grafiği"
---

Bir SIEM'in "bulgu yok" demesinin iki farklı anlamı var: ya ortamda gerçekten kötücül bir davranış yok, ya da davranış var ama onu yakalayacak kural yok. Kural setinizi yazan siz değilseniz bu ikisini birbirinden ayırmanın tek yolu, yakalaması gereken davranışı kendiniz üretip kuralın gerçekten tetiklenip tetiklenmediğine bakmak. Aşağıda MITRE Caldera'da kurduğumuz bir emülasyon turunu ve Splunk tarafında buna karşılık verdiğimiz tespitleri, olduğu gibi paylaşıyoruz — çalışan kısmıyla, henüz kapatamadığımız açıkla birlikte.

## Neyi kurduk

Caldera'da "HOOKEDGE" adını verdiğimiz kurgusal bir adversary profili oluşturduk: APT28'in (MITRE ATT&CK grup kaydı G0007) belgelenmiş bazı davranış kalıplarından esinlenen, dört adımlık bir teknik zinciri. Bunun bir netleştirme yapmakta fayda var — bu, APT28'e ait belirli bir zararlı yazılımın birebir kopyası değil; grubun bilinen taktiklerini temel alan, laboratuvar ortamında güvenle çalıştırılabilecek bir emülasyon.

Zincir şöyle kuruldu: bir Windows hedefinde (`win-target1`) önce kalıcılık kazanılıyor, sonra tarayıcı trafiğine gizlenmiş bir C2 kanalı üzerinden komut çekiliyor, ardından aynı kanaldan veri sızdırılıyor, son olarak da iz temizleniyor.

| Sıra | Ability | Taktik | Teknik (ATT&CK) | APT28 ile ilişkisi |
|---|---|---|---|---|
| 1 | Scheduled Task Persistence | persistence | [T1053.005](https://attack.mitre.org/techniques/T1053/005/) | MITRE'ın G0007 kaydında APT28'e özgü belgelenmiş değil; zinciri tamamlamak için genel/yaygın bir kalıcılık tekniği olarak eklendi |
| 2 | Hidden Edge C2 Pull | command-and-control | [T1071.001](https://attack.mitre.org/techniques/T1071/001/) | APT28, CHOPSTICK implantlarında C2 için HTTP/HTTPS gibi web protokollerini kullanıyor |
| 3 | Hidden Edge Exfil POST | exfiltration | [T1567](https://attack.mitre.org/techniques/T1567/) | APT28, Nearest Neighbor kampanyasında Google Drive gibi web servisleri üzerinden veri sızdırdı |
| 4 | Cleanup Traces | defense-evasion | [T1070.004](https://attack.mitre.org/techniques/T1070/004/) | APT28'in CCleaner ile iz temizlediği belgeleniyor |

Üçüncü sütundaki dördüncü satır dışındaki üç ilişki [MITRE ATT&CK'ın APT28 (G0007) grup sayfasında](https://attack.mitre.org/groups/G0007/) doğrudan yer alıyor; zamanlanmış görev üzerinden kalıcılık ise APT28'e özgü olarak belgelenmiş değil — bunu olduğu gibi yazıyoruz, çünkü bir tekniği bir gruba mal etmek için MITRE'ın kendi kaynağını referans almayan bir iddia bizim için yeterli değil.

C2 ve sızdırma kanalı olarak `msedge.exe`'yi `--headless` bayrağı ya da pencereyi ekranın görünür alanının tamamen dışına taşıyan bilinen bir konum hilesiyle (`-32000` gibi) çalıştırdık; hedef adres olarak da gerçek bir saldırgan altyapısı kurmadan HTTP isteği alıp gösterebilen, tek kullanımlık bir uç nokta olan webhook.site'i kullandık. Amaç, "tarayıcı süreci ağa çıkıyor ama kullanıcı hiçbir pencere görmüyor" davranışını, kendi altyapımızı riske atmadan gerçekçi biçimde üretmekti.

![HOOKEDGE-Sim adı altındaki dört ability ve tekniklerini listeleyen Caldera Adversaries ekranı](/blog/apt28-ttp-emulasyonu-caldera-splunk/01-adversary-profili.png)

## Operasyon: dört adımın dördü de çalıştı

"APT-28 LAB Deresys 1" operasyonunu otonom modda çalıştırdık. Dört ability da art arda, insan müdahalesi olmadan ve hepsi "success" statüsüyle tamamlandı — kalıcılıktan iz temizlemeye kadar toplam operasyon süresi iki dakikanın biraz üzerinde.

![Caldera operasyon sonuç tablosu: dört tekniğin tamamı success statüsüyle tamamlanmış](/blog/apt28-ttp-emulasyonu-caldera-splunk/02-operasyon-sonuclari.png)

Buraya kadar olan kısım saldırgan tarafı. Asıl soru şu: Splunk'ta bu dört adımın kaçı görünür oldu, kaçı bir alarma bağlandı?

## Tespit tarafı: önce tek tek, sonra zincir olarak

Her adım için ayrı bir arama yazdık, sonra bunları tek bir korelasyon sorgusunda birleştirdik. Sıra, saldırı zincirinin sırasıyla aynı.

### 1) Kalıcılık: zamanlanmış görev — görünür ama alarma bağlı değil

Windows Görev Zamanlayıcısı'nın operational logundaki 106 numaralı olay (yeni görev kaydı), görev adını ve kaydı yapan kullanıcıyı doğrudan mesaj alanından çıkarmamıza yetiyor:

![Splunk'ta EventCode=106 üzerinden zamanlanmış görev kaydını gösteren arama](/blog/apt28-ttp-emulasyonu-caldera-splunk/03-zamanlanmis-gorev-aramasi.png)

Bu sinyal ucuz ve erken geliyor, ama tek başına düşük güvenilirlikli: kurumsal ortamda yazılım kurulumları ve yönetim araçları da sürekli zamanlanmış görev oluşturuyor. Bu yüzden laboratuvarda bunu bir alarma değil, yalnızca ham bir aramaya bağladık — aşağıdaki "Sonuç" bölümünde göreceğiniz gibi, tetiklenen alarmlar arasında bu adım için ayrı bir kayıt yok.

### 2) C2: gizli pencereli Edge süreci

`msedge.exe`'nin `--headless` ya da ekran dışı pencere konumuyla başlatılmasını Sysmon'un 1 numaralı olayından (süreç oluşturma) yakalıyoruz:

![Sysmon EventCode=1 üzerinden msedge.exe'nin headless/gizli pencere bayraklarıyla başlatılmasını arayan Splunk sorgusu](/blog/apt28-ttp-emulasyonu-caldera-splunk/04-headless-edge-aramasi.png)

### 3) C2 ve sızdırma: webhook.site'e giden bağlantı

Aynı sürecin ağ bağlantısını (Sysmon EventCode 3) hedef adı `webhook.site` olacak şekilde filtreliyoruz. Operasyonda hem C2 çekme hem sızdırma adımı aynı uç noktayı kullandığı için, bu arama iki ayrı ability'nin ağ izini de yakalıyor:

![Sysmon EventCode=3 üzerinden msedge.exe'den webhook.site'e giden bağlantıyı arayan Splunk sorgusu](/blog/apt28-ttp-emulasyonu-caldera-splunk/05-webhook-baglanti-aramasi.png)

Süreç oluşturma ve ağ bağlantısı ayrı veri kaynakları olduğu için ikisini ayrı aramalar olarak tuttuk; biri diğerinin yerine geçmiyor.

### 4) Zincir: "APT28 keşif" korelasyonu

Tek tek her sinyal orta güvenilirlikli — headless tarayıcı otomasyonu meşru amaçlarla da kullanılabiliyor, webhook.site'e giden tek bir istek de öyle. Bunları aynı host üzerinde birleştirdiğimizde güven artıyor. Bunun için `tstats` ile uç nokta veri modelinden headless `msedge.exe` süreçlerini, ham Sysmon aramasıyla da webhook.site bağlantılarını çekip host bazında birleştiren tek bir sorgu yazdık:

![tstats ve Sysmon aramasını host bazında birleştiren APT28 keşif korelasyon sorgusu](/blog/apt28-ttp-emulasyonu-caldera-splunk/06-korelasyon-aramasi.png)

## Sonuç: üç tespit, dört tetiklenen alarm, bir açık nokta

Operasyon bittikten sonra Splunk'ta tetiklenen alarmlara baktık:

![Splunk'ta tetiklenen dört alarm kaydı: Headless Edge, iki kez Webhook Bağlantı, APT28 keşif](/blog/apt28-ttp-emulasyonu-caldera-splunk/07-tetiklenen-alarmlar.png)

Dört kayıt var: "Headless Edge" (High), "Webhook Bağlantı" iki kez (High — biri C2 çekme, biri sızdırma isteğine karşılık geliyor), ve en son "APT28 keşif" (Critical) korelasyon alarmı. Korelasyon alarmının en son ve en yüksek önem derecesiyle tetiklenmesi beklenen bir sonuç: ancak diğer sinyaller göründükten sonra tetiklenebiliyor.

Ama listede olmayan iki şey de en az bu dördü kadar önemli. Zamanlanmış görev adımı bir aramada görünüyordu ama hiçbir alarma bağlı değildi — yani bugün biri bu tekniği tek başına kullansa, elimizde bunu yakalayacak canlı bir kural yok. İz temizleme adımı (T1070.004, dosya silme) için ise ne ayrı bir arama ne de bir alarm var; operasyon tarafında dördüncü ability sorunsuz çalıştı, tespit tarafında buna karşılık gelen hiçbir şey yok.

Bir emülasyon turunun asıl değeri de burada. Neyin göründüğünü doğrulamak kolay kısmı; neyin görünmediğini somut olarak ortaya koymak, ancak böyle bir turdan sonra mümkün oluyor.

## Neden bunu yapıyoruz

Bu tür turlar, SIEM içerik yönetimi ve tespit mühendisliği çalışmalarımızın rutin bir parçası. Bir kuralın var olması ile o kuralın tanımlandığı tekniği gerçekten yakalaması aynı şey değil; ikisi arasındaki farkı görmenin bildiğimiz tek yolu, tekniği üretip kurala göndermek. Bu yazı da tam olarak öyle bir turun kaydı — abartısız, eksiğiyle birlikte.
