# COPY.md

deresys.com.tr sayfa metinleri. Kaynak: CONTEXT.md, D:\Deresys\hizmetler
altındaki hizmet tasarımı ve pazarlama dokümanları.

Bu dosya Türkçe metni içerir. İngilizce sürüm, Türkçe onaylandıktan sonra
ayrı geçişte eklenecektir.

`[DOLDURULACAK]` işaretli bölümler için doğrulanmış veri bulunmadığından
boş bırakılmıştır. Her birinin altında hangi bilginin gerektiği yazılıdır.

Sürüm 3 — 2026-08-23

**Sürüm 3'te değişenler:**
- Ana sayfadaki hero CTA'sı ("Görüşme talep edin") kaldırıldı — üst menüde
  zaten aynı buton bulunduğu için sayfa açılışında iki kez tekrar ediyordu.
- Üst menüdeki "Çözümler" etiketi "Hizmetler" olarak güncellendi (URL
  `/cozumler` değişmedi).
- Hizmetler üç ana başlıkta yeniden gruplandı: Danışmanlık Hizmetleri
  (Olay Müdahalesi, vCISO, Siber Güvenlik Olgunluk Programı), Operasyonel
  Hizmetler (MSS, Splunk Destek ve Kural İçeriği), Siber Güvenlik Akademisi
  (Olay Müdahale Eğitimi).
- SOC Advisory sayfası kaldırıldı; kapsamı MSS sayfasına taşındı. Eski URL
  (`/cozumler/soc-advisory`) `/cozumler/mss`'e yönlendiriyor.
- Olay Müdahalesi sayfasındaki OM-1 (eğitim) modülü, kendi ayrıntılı
  sayfasına taşındı (Siber Güvenlik Akademisi > Olay Müdahale Eğitimi);
  Olay Müdahalesi sayfasında artık kısa bir bağlantı kartı olarak duruyor.
- vCISO, MSS ve Olay Müdahale Eğitimi sayfalarının metni dolduruldu
  (önceden iskeletti).
- Splunk Destek ve Kural İçeriği yeni bir sayfa olarak eklendi; içerik
  brifi bekleniyor, şu an iskelet.

---

## Site geneli — üst menü

Üst menüde, sayfa linklerinin yanında iki buton bulunur:

- **Olay müdahale talebi** — WhatsApp'a (`905521238956`) doğrudan yönlendirir,
  yeni sekmede açılır. Ön dolgulu mesaj: "Merhaba, bir güvenlik olayıyla
  ilgili DERESYS ile iletişime geçmek istiyorum." Bu, `/hotline` sayfasındaki
  abonelik modelli müdahale hattından farklıdır; hattın "hazırlık
  aşamasında" olduğuna dair not (bkz. bölüm 13) geçerliliğini korur — bu
  buton hattın kendisi değil, doğrudan bir iletişim kanalıdır. Yanıt süresi
  veya SLA taahhüdü ima edilmez.
- **Görüşme talep edin** — `/iletisim` sayfasına gider (mevcut).

Ana sayfada bu butonun ayrıca hero bölümünde tekrarlanan bir kopyası vardı;
üst menüde zaten göründüğü için kaldırıldı. Sayfa sonundaki "Nereden
başlanır" bölümündeki CTA olduğu gibi kalıyor.

---

## Sayfa envanteri

| # | Sayfa | URL | Grup | Durum |
|---|---|---|---|---|
| 1 | Ana Sayfa | `/` | — | Metin hazır |
| 2 | Hizmetler | `/cozumler` | — | Metin hazır |
| 3 | Olay Müdahalesi | `/cozumler/olay-mudahalesi` | Danışmanlık | Metin hazır |
| 4 | vCISO | `/cozumler/vciso` | Danışmanlık | Metin hazır |
| 5 | Siber Güvenlik Olgunluk Programı | `/cozumler/olgunluk-programi` | Danışmanlık | Metin hazır |
| 6 | MSS — Güvenlik Sağlığı İzleme | `/cozumler/mss` | Operasyonel | Metin hazır (ek kapsam bölümü iskelet) |
| 7 | Splunk Destek ve Kural İçeriği | `/cozumler/splunk-destek` | Operasyonel | İskelet — brif bekleniyor |
| 8 | Olay Müdahale Eğitimi | `/cozumler/olay-mudahale-egitimi` | Akademi | Metin hazır |
| — | ~~SOC Advisory~~ | ~~`/cozumler/soc-advisory`~~ | — | Kaldırıldı — `/cozumler/mss`'e yönlendiriyor |
| 9 | Hakkında | `/hakkinda` | — | Metin hazır — karar bekliyor |
| 10 | Blog | `/blog` | — | Metin hazır |
| 11 | Ürünler | `/urunler` | — | Metin hazır |
| 12 | İletişim | `/iletisim` | — | Metin hazır — form entegre edildi |
| 13 | Olay Müdahale Hattı | `/hotline` | — | Metin hazır |
| 14 | KVKK Aydınlatma Metni | `/kvkk` | — | Hukuki metin bekliyor |
| 15 | 404 | — | — | Metin hazır |

---

## 1. Ana Sayfa — `/`

**Title:** DERESYS — Siber Güvenlik Danışmanlığı
**Meta description:** Danışmanlık hizmetleri, operasyonel hizmetler ve siber güvenlik akademisi ile siber güvenlik yapınızı değerlendirir ve geliştiririz.

### Eyebrow
SİBER GÜVENLİK DANIŞMANLIĞI

### H1
Güvenli, akıllı, sürekli

### Açılış
DERESYS, kurumların siber güvenlik yapısını değerlendiren ve geliştiren bir
danışmanlık şirketidir. Üç başlıkta çalışıyoruz: danışmanlık hizmetleri,
operasyonel hizmetler ve siber güvenlik akademisi.

Çalışmalarımız genellikle aynı soruyla başlıyor. Bir güvenlik yatırımı
yapılmış, araçlar kurulmuş, süreçler tanımlanmış oluyor; ama bunların
gerçekte ne kadarının efektif bir koruma sağladığı kurum içinden bakınca
net görünmüyor.

Bu noktada DERESYS kendine özgü metodolojilerle, yapılan yatırımlardan en
yüksek faydayı ve korumayı sağlamak üzere planı çıkarır ve programı
kurumla birlikte uygulamaya koyar.

*(Hero'daki [CTA: Görüşme talep edin] kaldırıldı — bkz. "Site geneli".)*

### H2 — Danışmanlık Hizmetleri
Güvenlik olgunluğunuzu ölçer, olay müdahale hazırlığınızı kurar ve vCISO
olarak bilgi güvenliği yönetişimini üstleniriz.

Olay Müdahalesi, vCISO ve Siber Güvenlik Olgunluk Programı bu başlık
altında.
[Bağlantı: /cozumler#danismanlik]

### H2 — Operasyonel Hizmetler
SIEM ortamınızın işletimsel sağlığını ve tespit kapsamını periyodik olarak
doğrular, Splunk destek ve kural ihtiyaçlarınızı karşılarız.

MSS ve Splunk Destek ve Kural İçeriği bu başlık altında.
[Bağlantı: /cozumler#operasyonel]

### H2 — Siber Güvenlik Akademisi
Bilgi işlem ve güvenlik ekibinizi olay müdahalesinde uygulamalı,
laboratuvar ağırlıklı eğitimle hazırlarız.

Olay Müdahale Eğitimi bu başlık altında.
[Bağlantı: /cozumler#akademi]

### H2 — Yazdıklarımız
Nasıl çalıştığımızı görmek isterseniz blogu okuyabilirsiniz. Tespit
kuralları, SIEM içerik yönetimi, olay müdahale pratiği ve uyum çerçeveleri
üzerine yazıyoruz.
[Son 3 blog yazısı]
[Bağlantı: Tüm yazılar]

### H2 — Nereden başlanır
Hangi hizmetin size uyduğundan emin değilseniz kısa bir görüşme genellikle
yeterli oluyor. Mevcut durumunuzu dinleyip nereden başlamanın mantıklı
olacağını konuşuruz.

[CTA: Görüşme talep edin]

---

## 2. Hizmetler — `/cozumler`

**Title:** Hizmetler — Siber Güvenlik Danışmanlık Hizmetleri | DERESYS
**Meta description:** Danışmanlık hizmetleri, operasyonel hizmetler ve siber güvenlik akademisi: olay müdahalesi, vCISO, olgunluk programı, MSS, Splunk destek ve olay müdahale eğitimi.

### H1
Siber güvenlik danışmanlık hizmetleri

### Açılış
Hizmetlerimizi üç başlıkta topluyoruz: danışmanlık hizmetleri, operasyonel
hizmetler ve siber güvenlik akademisi. Her biri ayrı alınabilir, birlikte
alındığında da birbirini tekrar etmez.

Aşağıdaki kısa tariflerden hangisinin durumunuza benzediğine bakabilirsiniz.

### Grup — Danışmanlık Hizmetleri (`#danismanlik`)
Kurumunuzun güvenlik yapısını değerlendirir, hazırlar ve yönetişimini
üstleniriz.

**OM — Olay Müdahalesi**
Hazırlık projesi, masabaşı tatbikat ve müdahale hattıyla ekibinizin olay
anında ne yapacağını önceden bilmesini sağlarız.
Şu durumda uygun: bir olay planınız var ama hiç denenmedi; ya da ekipte
müdahale deneyimi sınırlı ve bunu olay anında keşfetmek istemiyorsunuz.
[Bağlantı: /cozumler/olay-mudahalesi]

**vCISO**
İhtiyacınıza göre üç modelde çalışırız: şirketinizin fiilen CISO'su gibi
görev alırız, mevcut ekibinize ikinci göz sağlarız ya da doğrudan yönetim
kurulunuza brifing veririz.
Şu durumda uygun: tam zamanlı bir CISO'ya bütçeniz yok, ama SPK, BDDK,
Siber Güvenlik Kanunu veya EPDK gibi bir düzenleme sizi bilgi
güvenliğinden üst yönetim seviyesinde sorumlu tutuyor.
[Bağlantı: /cozumler/vciso]

**OP — Siber Güvenlik Olgunluk Programı**
Güvenlik kontrollerinizin mevcut durumunu ölçer, puanlar ve
önceliklendirilmiş bir iyileştirme planı üretiriz.
Şu durumda uygun: yatırım yapılmış ama bütünsel resim yok; ya da yönetime
mevcut durumu ve gidilecek yeri ölçülebilir biçimde anlatmanız gerekiyor.
[Bağlantı: /cozumler/olgunluk-programi]

### Grup — Operasyonel Hizmetler (`#operasyonel`)
Güvenlik çözümlerinizin gün geçtikçe sağlıklı ve güncel kalmasını sürekli
hâle getiririz.

**MSS — Güvenlik Sağlığı İzleme**
Splunk ve IBM QRadar gibi SIEM ortamlarınızı periyodik olarak kontrol
eder, işletimsel sağlığını ve MITRE ATT&CK'e göre tespit kapsamını düzenli
raporlarla size sunarız.
Şu durumda uygun: kurumsal bir SIEM'e yatırım yaptınız ama bunu sürekli
sağlıklı tutacak uzmanlık kapasiteniz sınırlı; ya da hizmet aldığınız bir
MSSP'nin ürettiği tespitlerin kapsamını bağımsız bir gözle görmek
istiyorsunuz.
[Bağlantı: /cozumler/mss]

**Splunk Destek ve Kural İçeriği**
Splunk ortamınızda kural geliştirme, içerik bakımı ve teknik destek
sağlarız.
Şu durumda uygun: Splunk kullanıyorsunuz ve kural/içerik tarafında sürekli
bir uzmanlık desteğine ihtiyacınız var.
[Bağlantı: /cozumler/splunk-destek]
> Not: Bu sayfanın gövde metni henüz brif bekliyor — bkz. bölüm 7.

### Grup — Siber Güvenlik Akademisi (`#akademi`)
Ekibinizi olay müdahalesinde uygulamalı eğitimle hazırlarız.

**OM-1 — Olay Müdahale Eğitimi**
Bilgi işlem ve güvenlik ekibiniz için 3 günlük, laboratuvar ağırlıklı
uygulamalı eğitim; delil bozmadan hareket etme, doğru sırayla toplama,
zaman çizelgesi çıkarma ve raporlama.
Şu durumda uygun: ekibinizin olay anında ilk 60 dakikada ne yapacağını
netleştirmek istiyorsunuz; adli inceleme deneyimi aranmaz.
[Bağlantı: /cozumler/olay-mudahale-egitimi]

### H2 — Yapmadığımız işler
Sızma testi, SOC operasyonu ve MDR hizmeti vermiyoruz.

MSS kapsamımız güvenlik sağlığı izleme ve tespit kapsamı denetimiyle
sınırlıdır; 7/24 SOC operasyonu veya tehdit avcılığı içermez. Bu
hizmetlere ihtiyacınız varsa çalıştığımız firmalara yönlendirebiliriz.

---

## 3. Olay Müdahalesi — `/cozumler/olay-mudahalesi` (Danışmanlık)

**Title:** Olay Müdahale Hazırlığı ve Tatbikat | DERESYS
**Meta description:** Olay müdahale hazırlığı: hazırlık projesi, masabaşı tatbikat ve müdahale hattı.

### H1
Olay müdahale hazırlığı

### Açılış
Fidye yazılımı fark edildiğinde teoride müdahale başlar. Uygulamada ilk
gün "kimi arayacağız" sorusu, teklif toplama ve sözleşme müzakeresiyle
geçer. Bu sürenin tamamı kayıptır: bellek içeriği ve kısa saklama süreli
kayıtlar silinir, saldırgan yayılmaya devam eder, yasal bildirim süresi
işler. Olay anında işleyen bir müdahale süreci olaydan önce kurulur.

### H2 — Olay müdahale eğitimi (OM-1)
Ekibiniz ilk 60 dakikada ne yapacağını biliyor mu? 3 gün, uygulamalı,
laboratuvar ağırlıklı eğitim; ayrıntılı program artık Siber Güvenlik
Akademisi altında.
[Bağlantı: Olay Müdahale Eğitimi — bkz. bölüm 8]

### H2 — Olay müdahale hazırlık projesi (OM-2)
6–8 hafta süren bir çalışmada politika, rol ve eskalasyon matrisi,
iletişim planı ve KVKK bildirim akışı hazırlarız; beş senaryo için
playbook yazar, delil hazırlığı boşluk analizi yapar ve tüm ekibe
dağıtılan bir Olay Anı Kartı üretiriz.

### H2 — Masabaşı tatbikat (OM-3)
Yılda 2 oturum: biri teknik ekiple, biri yönetim ve kriz masasıyla
yürütülür. Kuruma özel bir senaryo, zamanlanmış gelişmeler, karar
sürelerinin ölçümü ve önceliklendirilmiş bir aksiyon listesiyle sonuçlanır.

### H2 — Olay müdahale hattı (OM-4)
Abonelik modeliyle sunulacak müdahale hattı hazırlık aşamasındadır.
[Bağlantı: Olay Müdahale Hattı]

> Not: Kaynak dokümanda (D:\Deresys\hizmetler\Olay Müdahale) OM-4 için
> "yazılı yanıt süresi taahhüdü" gibi ifadeler var; bu, hattın henüz
> devreye girmediğini söyleyen mevcut site politikasıyla çelişiyor. Site
> metnine bilerek eklenmedi — hat açıldığında OM-4 metni ayrıca yazılmalı.

[CTA: Görüşme talep edin]

---

## 4. vCISO — `/cozumler/vciso` (Danışmanlık)

**Title:** vCISO Hizmeti | DERESYS
**Meta description:** vCISO hizmeti: Outsource CISO, CISO danışmanlığı ve yönetim kurulu danışmanlığı modelleriyle bilgi güvenliği yönetişimi.

### H1
vCISO

### Lead
Tam zamanlı bir CISO'ya bütçeniz olmayabilir; ama bilgi güvenliği
yönetişimi sorumluluğu üzerinizde kalmaya devam ediyor. DERESYS bu
sorumluluğu ihtiyacınıza göre üç modelden birinde üstlenir.

### H2 — Neden vCISO
SPK, BDDK, Siber Güvenlik Kanunu ve EPDK gibi düzenlemeler kurumları
bilgi güvenliğinden üst yönetim seviyesinde sorumlu tutuyor. Bankacılık
dışında bu düzenlemelerin hiçbiri resmi unvanlı, tam zamanlı bir CISO
atanmasını açıkça şart koşmuyor — ama hepsi, birinin bu sorumluluğu fiilen
taşımasını bekliyor.

### H2 — Üç model
**Model 1 — Outsource CISO**
Şirketinizin fiilen CISO'su gibi çalışırız: politika seti, risk
analizinin yönetimi, pentest ve iç denetim koordinasyonu, olay müdahale
planı ve yönetim kuruluna düzenli raporlama.
Resmi bir CISO'su olmayan, SPK / EPDK / kritik altyapı kapsamındaki orta
ölçekli şirketler için.

**Model 2 — CISO Danışmanlığı**
Mevcut güvenlik ekibinize ikinci göz, regülasyon uzmanlığı ve proje bazlı
destek sağlarız; politika ve prosedür taslaklarını inceleriz.
Kendi BT/güvenlik ekibi olan bankalar ve büyük kuruluşlar için.

**Model 3 — Yönetim Kurulu Danışmanlığı**
CISO'nun yerine geçmeden, doğrudan yönetim kurulunuza veya denetim
komitenize periyodik, anlaşılır ve regülasyona bağlanmış siber risk
brifingleri sunarız.
Bankalar, halka açık şirket yönetim kurulları ve büyük kurumlar için.

### H2 — Kapsam dışı
Sistemlerinize yazma veya değişiklik erişimi talep etmeyiz; teknik
uygulama kendi ekibinizde veya ayrı bir sözleşme kapsamındaki MSS
hizmetimizde kalır.

Bu hizmet hukuki danışmanlık yerine geçmez; regülasyon
değerlendirmelerimiz teknik ve operasyonel niteliktedir. Regülatöre resmi
bildirim ve beyan kararı ve imzası her zaman sizde kalır, biz yalnızca
süreç desteği sağlarız.

Risk analizi ve pentest gibi bağımsız değerlendirme gerektiren
süreçlerde üçüncü taraf sağlayıcılarla koordineli çalışırız; bu süreçleri
kendimiz yürütmeyiz.

> Not: "Bağımsızlık ilkesi" ifadesi kasıtlı olarak kullanılmadı — yazım
> kurallarına göre bu ifade sitede yalnızca Hakkında ve Ürünler
> sayfalarında geçiyor.

### H2 — Kimler için uygun
Hangi modelin size uyduğu, kurumunuzun tabi olduğu regülasyona ve mevcut
güvenlik ekibinizin büyüklüğüne göre değişir. Bunu birlikte netleştiririz.

[CTA: Görüşme talep edin]

> Kaldırılan not: "vCISO taahhüdü eşzamanlı kapasiteyi doğrudan bağlar"
> uyarısı kaldırıldı çünkü sayfa metninde zaten hiçbir kapasite/sayı
> iddiası yok (yazım kurallarına uygun).

---

## 5. Siber Güvenlik Olgunluk Programı — `/cozumler/olgunluk-programi` (Danışmanlık)

*(Sürüm 3 — D:\Deresys\hizmetler\sgop altındaki Metodoloji v1.0, Kapsam
v1.0 ve Pazarlama İçerik Seti v1.0 dokümanlarına göre yazıldı. Başlık
"Değerlendirmesi" değil "Programı" olarak değiştirildi. "Kimler için
uygun" ayrı bir bölüm olmaktan çıktı, "Bu sayfa size mi?" öz
değerlendirme listesiyle birleştirildi; paket tablosundaki "uygun
olduğu profil" satırı bu bilgiyi paket bazında zaten taşıyor.)*

**Title:** Siber Güvenlik Olgunluk Programı | DERESYS
**Meta description:** Deresys Güvenlik Kontrolleri (DGK) ile 18 alanda 99
kontrolü ölçen, önceliklendirilmiş bir yol haritasına çeviren ve yıllık
olarak tekrar ölçen siber güvenlik olgunluk programı.

### Lead
Deresys Siber Güvenlik Olgunluk Programı, kurumunuzun güvenlik
olgunluğunu 99 kontrol üzerinden ölçer, çıkan boşlukları 12 aylık bir
yol haritasına çevirir, bu yol haritasını sizinle birlikte yürütür ve
bir yıl sonra aynı kontrol setiyle tekrar ölçer — ürün satmadan.

### H2 — Bu sayfa size mi?
Aşağıdakilerden biri sizin durumunuzsa, bu program size göre:
- Güvenlikten sorumlu birisi var, ama o kişinin asıl işi güvenlik değil.
- Bir müşteriniz veya iş ortağınız güvenlik anketi gönderdi ve hangi
  cevabın doğru olduğundan emin olamadınız.
- ISO 27001 belgelendirmesine karar verdiniz ama nereden başlayacağınızı
  bilmiyorsunuz.
- Bir denetimden bulgu aldınız ve bulguları kapatacak bir plana
  ihtiyacınız var.
- Güvenliğe para harcıyorsunuz ama harcamanın işe yarayıp yaramadığını
  gösteren bir sayı yok.
- Geçmiş bir danışmanlık raporu hâlâ bir klasörde duruyor.
- Güvenlik ekibiniz var, ama nereye ilerlediğinizi gösteren ortak bir
  ölçü yok.

### H2 — Kullanılan çerçeve
Satılan şey danışmanlık saati değil, iki ölçüm arasındaki farktır. Ölçüm
Deresys Güvenlik Kontrolleri'ne (DGK) dayanır: 18 kontrol alanında 99
kontrolü kapsayan, kanıt bazlı altı seviyeli bir olgunluk skalasıyla
puanlanan bir çerçeve. Beyan puan almaz; her kontrolün gösterilebilir
bir kanıtı olması gerekir.

Skorunuz ISO/IEC 27001:2022, NIST CSF 2.0, CIS Controls v8.1, KVKK ve
7545 sayılı Siber Güvenlik Kanunu'na eşlenmiş halde teslim edilir —
denetçi, sigortacı, müşteri anketi ve düzenleyici için ayrı ayrı çalışma
yapmak yerine tek bir ölçüm yeterli olur.

### H2 — Nasıl ilerliyor
1. **Ölçeriz** — DGK ile 18 alanda 99 kontrolü kanıta dayalı olarak
   puanlarız, beyanla değil gösterilebilen çıktıyla. Dört adam-günlük bu
   çalışmanın sonunda olgunluk skorunuz, öncelikli bulgularınız ve 12
   aylık yol haritanız elinizde olur.
2. **Yol haritasını kurarız** — bulgular kritiklik ve iş etkisine göre
   önceliklendirilir (P1/P2/P3) ve çeyreklere dağıtılır. Her maddenin
   sahibi, bağımlılığı ve kabul kriteri yazılıdır.
3. **Yürütürüz** — seçtiğiniz pakete göre düzenli temas, yazılı
   raporlama ve periyodik yönetim sunumuyla yol haritasını birlikte
   ilerletiriz. Kapanan her madde kanıtla doğrulanır ve yeniden
   puanlanır.
4. **Yılda bir tekrar ölçeriz** — aynı kontrol seti, aynı skala.
   İlerleme yorumla değil, iki sayı arasındaki farkla gösterilir.

### H2 — Paketler
Dört pakette de aynı kontrol seti yürütülür ve aynı rapor tipleri
üretilir. Farklılaşan şey temas sıklığı, raporlama periyodu ve bir
çeyrekte fiilen çalışılabilecek kontrol alanı sayısıdır — kapsamı
daraltarak ucuzlatmıyoruz.

| | OP-1 Temel | OP-2 Düzenli | OP-3 Aktif | OP-4 Yerleşik |
|---|---|---|---|---|
| Temas | Çeyrekte 1 | Ayda 1 | 2 haftada 1 | Haftada 1 |
| Raporlama | Aylık özet | Aylık rapor | 2 haftada 1 not | Haftalık |
| Yönetim bilgilendirmesi | Yılda 2 | Çeyreklik | Çeyreklik + kurul | Aylık + kurul |
| Yanıt süresi | 48 saat | 24 saat | 8 saat | 4 saat |
| 12 ayda kapsanan alan | 4 | 8 | 16 | 18 (tamamı) |

Fiyat bu sayfada yer almıyor; hangi paketin uygun olduğu birlikte
netleştirilir.

### H2 — Çıktılar
- **Olgunluk skor kartı** — yönetim kuruluna güvenliği tek sayfada anlatır
- **Kontrol bazlı bulgu kaydı** — teknik ekibin çalışma listesi
- **Önceliklendirilmiş yol haritası** — bütçe ve takvim kararlarının dayanağı
- **Risk kaydı** — denetimde ilk istenen belge
- **Çerçeve uyum matrisi** — ISO, NIST CSF, CIS ve KVKK'ya eşlenmiş skor;
  anket ve ihale dosyalarına doğrudan girdi
- **Dönemsel yönetim raporu** — programın ilerlediğinin kanıtı

Tüm çıktılar kurumun mülkiyetindedir.

### H2 — Yapmadıklarımız
- Ürün satmıyoruz. Değerlendirdiğimiz kuruma lisans, donanım veya
  bayilik hizmeti vermiyoruz.
- 7/24 izleme (SOC/MDR) yapmıyoruz. İhtiyacınız varsa bağımsız bir
  sağlayıcı seçiminde yardımcı oluruz.
- Sızma testi yapmıyoruz. Kontrolün tasarımına katkı veren taraf aynı
  kontrolü test etmemeli; testi bağımsız bir taraf yapar, biz bulguları
  yönetiriz.
- Sistemlerinizi işletmiyoruz. Program bir yönetişim çalışmasıdır;
  kurulum ve bakım BT ekibinizin işidir.
- CISO'nuzun yerine geçmiyoruz. Bu bir ölçüm ve yürütme programıdır;
  güvenlik yöneticiliğinin dışarıdan üstlenilmesini istiyorsanız bu ayrı
  bir hizmettir (vCISO).

[CTA: Görüşme talep edin]

> Not: Fiyatlandırma, sektörel varyasyonlar (EKS/OTG, EPDK, 7545) ve
> R1–R7 rapor kodları bilinçli olarak sayfaya taşınmadı — bunlar iç
> kullanım/teklif dokümanlarında kalıyor; web metni müşteriye dönük
> özetle sınırlı tutuldu.

---

## 6. MSS — Güvenlik Sağlığı İzleme — `/cozumler/mss` (Operasyonel)

**Title:** MSS — Güvenlik Sağlığı İzleme | DERESYS
**Meta description:** Splunk ve IBM QRadar ortamlarınız için periyodik güvenlik sağlığı izleme ve MITRE ATT&CK tespit kapsamı analizi.

### H1
Güvenlik sağlığı izleme

### Lead
Güvenlik yatırımlarınızın gerçekten sağlıklı çalıştığından emin olun.

### H2 — Sorun
Çoğu kurum SIEM, EDR ve DLP gibi güvenlik araçlarına ciddi yatırım
yapıyor. Ama bu araçların sağlıklı çalışıp çalışmadığını, kurallarının
güncel kalıp kalmadığını, hangi tehdit tekniklerine karşı hâlâ savunmasız
olduğunuzu kimse sistematik olarak takip etmiyor. Bu, güvenlik
yatırımlarının sessizce değer kaybettiği en yaygın kör noktalardan biri.

### H2 — Bu bir SOC hizmeti değildir
DERESYS 7/24 gerçek zamanlı izleme veya olay müdahalesi taahhüt etmez.
Sistemlerinize asla yazma veya değişiklik yetkisiyle erişmeyiz — yalnızca
gözlemler, doğrular ve raporlarız. Karar ve uygulama her zaman sizde
kalır.

### H2 — Nasıl çalışıyoruz
1. **Kapsam ve erişim** — hangi sistemlerin kapsama dahil olacağını
   birlikte belirleriz; erişim her zaman salt-okunurdur.
2. **İlk değerlendirme (baseline)** — ortamınızın kapsamlı bir ilk
   değerlendirmesi, sonraki raporlar için karşılaştırma noktası olur.
3. **Sürekli izleme** — günlük/haftalık aralıklarla işletimsel sağlık ve
   güvenlik durumu (MITRE ATT&CK'e göre tespit kapsamı) kontrolü.
4. **Raporlama ve danışmanlık** — günlük özet, haftalık analiz, aylık
   yönetici değerlendirmesi; kritik bulguda somut aksiyon önerisi.

### H2 — Yaptığımız / yapmadığımız
| Yaptığımız | Yapmadığımız |
|---|---|
| Periyodik (günlük/haftalık) sağlık ve güvenlik durumu kontrolü | 7/24 gerçek zamanlı izleme |
| MITRE ATT&CK'e göre tespit kapsamı analizi | Tehdit avcılığı (threat hunting) |
| Düzenli, yapılandırılmış raporlama | Olay müdahalesi (ayrı bir hizmetimiz olarak sunulur) |
| Somut aksiyon önerisi | Sistemlerinizde değişiklik veya müdahale yapma |

### H2 — Kimler için uygun
Splunk, IBM QRadar gibi kurumsal SIEM platformlarına yatırım yapmış; kendi
IT/güvenlik ekibi olan ama bu araçları sürekli sağlıklı tutacak özel
uzmanlık kapasitesi sınırlı olan orta ve büyük ölçekli kurumlar için
tasarlandı.

### H2 — Ek kapsam: SOC kurulumu ve etkinlik denetimi
SOC kurmayı planlıyorsanız tasarım ve devreye alma sürecinde çalışırız.
Halihazırda bir SOC'unuz ya da hizmet aldığınız bir MSSP varsa, üretilen
tespitlerin kapsamını ve kalitesini de MSS kapsamımız içinde
inceleyebiliriz. *(Eski SOC Advisory sayfasından taşındı.)*

**SOC kurulumu: entegratör ve MSSP'ler için** — [DOLDURULACAK: kapsam, çıktı, süre]
**SOC kurulumu: son kullanıcı kurumlar için** — [DOLDURULACAK: kapsam, çıktı, süre]
**MSSP etkinlik denetimi** — [DOLDURULACAK: kapsam, çıktı, süre; denetimin neyi ölçtüğü — kural kapsamı, tespit kabiliyeti, SLA uyumu vb.]

[CTA: Görüşme talep edin]

---

## 7. Splunk Destek ve Kural İçeriği — `/cozumler/splunk-destek` (Operasyonel)

**Title:** Splunk Destek ve Kural İçeriği | DERESYS
**Meta description:** [DOLDURULACAK]

### H1
Splunk destek ve kural içeriği

### Açılış
[DOLDURULACAK] — hizmetin bir paragraflık tanımı.

### H2 — Kapsam
[DOLDURULACAK] — hangi Splunk bileşenleri (Core, ES, ITSI vb.); destek mi,
kural/içerik geliştirme mi, ikisi birden mi.

### H2 — Çalışma modeli
[DOLDURULACAK] — proje mi, abonelik mi, saat havuzu mu; sıklık ve iletişim
kanalı.

### H2 — Çıktılar
[DOLDURULACAK] — teslim edilecek doküman, kural ve rapor listesi.

### H2 — Kimler için uygun
[DOLDURULACAK] — hedef müşteri profili.

[CTA: Görüşme talep edin]

> Not: Bu sayfa için hizmetler klasöründe kaynak doküman bulunamadı;
> içerik Mustafa'dan gelecek kısa brife göre yazılacak.

---

## 8. Olay Müdahale Eğitimi — `/cozumler/olay-mudahale-egitimi` (Akademi)

**Title:** Olay Müdahale Eğitimi | DERESYS Siber Güvenlik Akademisi
**Meta description:** 3 gün, laboratuvar ağırlıklı, uygulamalı siber olay müdahale eğitimi — OM-1.

### H1
Olay müdahale eğitimi

### Lead
Ekibiniz ilk 60 dakikada ne yapacağını biliyor mu? 3 gün, laboratuvar
ağırlıklı, uygulamalı bir siber olay müdahale eğitimi.

### H2 — Tasarım ilkesi
Bu bir uygulama eğitimidir. Süre dağılımı yaklaşık %20 anlatım, %80
laboratuvar çalışması. Katılımcı üç gün boyunca sekiz ayrı olayı kendi
makinesinde, gerçek emareler üzerinde inceler. Her olay bağımsız bir
delil setiyle gelir ve somut sorularla biter. Üç günün sonunda
katılımcının elinde sekiz doldurulmuş bulgu formu ve iki tam zaman
çizelgesi olur.

### H2 — Program
**Gün 1 — Uç nokta adli incelemesi:** Lab 0 (delil toplama ve bütünlük),
Olay 1 (uzak masaüstü üzerinden yetkisiz erişim), Olay 2 (kalıcılık ve
yürütme kalıntıları), zaman çizelgesi birleştirme.

**Gün 2 — Bellek, zararlı yazılım ve ağ:** Olay 3 (yalnızca bellekte
çalışan implant), Olay 4 (zararlı yazılım triyajı ve komut satırı
analizi), Olay 5 (komuta kontrol trafiği ve veri çıkışı).

**Gün 3 — Kimlik, ölçek ve kapanış vakası:** Olay 6 (Microsoft 365 hesap
ele geçirme), Olay 7 (ölçekte log analizi ve tespit kuralı üretimi),
Olay 8 (kapanış vakası — uçtan uca fidye olayı).

*(Tam olay listesi ve süreler web sayfasında; kaynak: D:\Deresys\hizmetler\Olay Müdahale\04-deresys-om1-egitim-programi.docx.)*

### H2 — Katılımcı ve ön koşullar
Hedef kitle: güvenlik operasyonu analistleri, sistem ve ağ yöneticileri,
bilgi güvenliği uzmanları, olay müdahale ekibi adayları. 8–14 kişi;
laboratuvarlar bireysel, kapanış vakası 3–4 kişilik gruplarla. Ön bilgi:
Windows sunucu/dizin hizmeti yönetimi, temel ağ bilgisi, komut satırı;
adli inceleme deneyimi gerekmez.

**Teknik gereksinim (kritik):** katılımcı başına en az 16 GB bellek
(tercihen 32 GB), en az 150 GB boş disk, sanallaştırma desteği açık ve
yönetici yetkisi olan dizüstü bilgisayar. Makineler eğitimden en az bir
hafta önce hazırlanmalı.

### H2 — Çıktılar
Eğitim materyal seti ve laboratuvar kılavuzları; sekiz olayın delil
setleri ve çözüm anahtarları; hızlı referans kartları; doldurulmuş bulgu
formları ve iki tam zaman çizelgesi; kapanış vakası değerlendirmesi ve
kuruma yönelik bir yetkinlik özeti.

### H2 — Değerlendirme
Her olay sonunda bulgu formu üzerinden ilerleme izlenir. Ölçüm kişi bazlı
raporlanmaz; kuruma yalnızca toplu sonuç ve gelişim alanları bildirilir.

### H2 — İlgili hizmet
Eğitim, olay müdahale hazırlığının tek bir parçasıdır. Hazırlık projesi,
masabaşı tatbikat ve müdahale hattı için bkz. bölüm 3 (Olay Müdahalesi).

[CTA: Görüşme talep edin]

---

## 9. Hakkında — `/hakkinda`

*(Değişmedi. Bkz. sürüm 2.)*

**Title:** Hakkında | DERESYS
**Meta description:** DERESYS Siber Güvenlik ve Teknoloji Ltd. Şti. — çalışma modeli ve yaklaşım.

### H1
DERESYS hakkında

### Açılış
DERESYS Siber Güvenlik ve Teknoloji Ltd. Şti., kurumların güvenlik
olgunluğunu ölçen, SOC yapılarını kuran ve denetleyen, olay müdahale
kabiliyeti geliştiren bir danışmanlık şirketidir.

### H2 — Nasıl çalışıyoruz

**Kapsamı baştan yazıyoruz.**
Ne yapılacağı, ne teslim edileceği ve neyin kapsam dışı olduğu sözleşme
öncesinde netleşir. Proje ortasında kapsam tartışması yaşanmasını
kimse istemiyor.

**Çıktı üzerinden ilerliyoruz.**
Bir programın sonunda elinizde ölçülmüş bir durum, üzerinde anlaşılmış
bir hedef ve ikisi arasındaki adımlar olur. İlerlemeyi bu tablo üzerinden
takip edebilirsiniz.

**Kapsamımız dışındaki işi almıyoruz.**
Sızma testi, SOC operasyonu ve MDR hizmeti vermiyoruz. Bu ihtiyaçlar için
yönlendirme yapabiliriz.

**Değerlendirdiğimiz kuruma ürün satmıyoruz.**
Ürün tedariki ayrı bir iş kolu olarak devam ediyor, ancak iki müşteri
grubu ayrı tutuluyor. Değerlendirme raporunu yazan tarafın o rapordan
gelir elde etmemesi bizce doğru olan.

### H2 — Neden içerik yayınlıyoruz
Yeni kurulmuş bir şirketiz ve gösterebileceğimiz bir referans listemiz yok.
Bunun yerine nasıl düşündüğümüzü okuyabilmeniz için yazıyoruz. Teknik
içerik, bir müşteri logosuna göre daha fazla bilgi verir.
[Bağlantı: Blog]

> **KARAR BEKLİYOR:** Kurucu biyografisi bu sayfaya eklenecek mi?
> Tek kişilik danışmanlıkta alıcı çoğunlukla kişisel geçmişi
> değerlendiriyor; isimsiz bir kurumsal sayfa bu beklentiyi
> karşılamıyor. CONTEXT.md kapsamı şirketle sınırlı tuttuğu için karar
> gerekli. Eklenirse hangi bilgilerin (deneyim, sertifika, önceki
> roller) yayınlanacağı ayrıca netleştirilmeli.

---

## 10. Blog — `/blog`

*(Değişmedi. Bkz. sürüm 2.)*

**Title:** Blog — Siber Güvenlik Teknik İçerik | DERESYS
**Meta description:** Tespit kuralları, SIEM içerik yönetimi, olay müdahalesi ve uyum çerçeveleri üzerine teknik yazılar.

### H1
Blog

### Açılış
Tespit kuralları, SIEM içerik yönetimi, olay müdahale pratiği ve uyum
çerçeveleri üzerine yazıyoruz. Yazıların çoğu sahada karşılaştığımız somut
problemlerden çıkıyor.

### H2 — Yeni yazılardan haberdar olun
Yeni yazı yayınlandığında e-posta gönderiyoruz, başka bir gönderi
yapmıyoruz.

[E-posta formu]
[Buton: Abone ol]

Aboneliğinizi her e-postadaki bağlantıdan sonlandırabilirsiniz.

---

## 11. Ürünler — `/urunler`

*(Değişmedi. Bkz. sürüm 2.)*

**Title:** Ürünler | DERESYS
**Meta description:** Üçüncü taraf siber güvenlik ürünleri tedariki.

### H1
Ürünler

### Açılış
Üçüncü taraf üreticilerin siber güvenlik ürünlerini tedarik ediyoruz.

Bu iş kolu danışmanlık hizmetlerimizden ayrı yürüyor. Değerlendirme veya
olgunluk programı müşterimizseniz size ürün satmıyoruz.

### H2 — Ürün grupları
[DOLDURULACAK]
> Gerekli: hangi üreticiler ve ürün kategorileri. Bayilik anlaşması
> bulunmayan üretici adı yazılmaz.

### H2 — Tedarik talebi
Belirli bir ürün için teklif almak isterseniz iletişime geçebilirsiniz.
[Bağlantı: İletişim]

---

## 12. İletişim — `/iletisim`

*(Değişmedi. Bkz. sürüm 2.)*

**Title:** İletişim | DERESYS
**Meta description:** Görüşme talebi ve iletişim bilgileri.

### H1
İletişim

### Açılış
Hangi hizmetin size uyduğundan emin değilseniz kısa bir görüşme genellikle
yeterli oluyor. Mevcut durumunuzu dinleyip nereden başlamanın mantıklı
olacağını konuşuruz.

### H2 — Görüşme talebi
[Form alanları: Ad soyad · Kurum · E-posta · Telefon (opsiyonel) · Mesaj]
[Buton: Gönder]

Bıraktığınız bilgiler yalnızca talebinize dönüş yapmak için kullanılır.
[Bağlantı: KVKK Aydınlatma Metni]

> Entegrasyon: Form, FormSubmit.co üzerinden `info@deresys.com.tr`
> adresine e-posta olarak iletilir (VPS backend'i olmadan, üçüncü parti
> servis). İlk gönderimde FormSubmit, bu adrese bir "Activate Form"
> onay e-postası gönderir — o e-postadaki bağlantıya tıklanmadan
> gönderimler teslim edilmez. Başarılı gönderim sonrası ziyaretçi
> `/iletisim?gonderildi=1` adresine yönlendirilir ve sayfada başarı
> mesajı gösterilir.
>
> CSP notu: `deploy/apache/deresys-security.conf` içindeki
> `form-action` yönergesine `https://formsubmit.co` eklendi — eklenmezse
> tarayıcı gönderimi sessizce reddeder. Bu dosya VPS'e yalnızca elle
> kopyalanır (git push ile otomatik yayılmaz); sunucudaki
> `/etc/apache2/conf-available/deresys-security.conf` de güncellenip
> Apache reload edilmeli.

### H2 — Doğrudan iletişim
E-posta: info@deresys.com.tr
Telefon: 0552 123 89 56
Adres: Deresys Siber Güvenlik - Gölbaşı/Ankara

---

## 13. Olay Müdahale Hattı — `/hotline`

*(E-posta formu info@deresys.com.tr'ye bağlandı — bkz. sürüm 3. VPS
entegrasyonu artık gerekmiyor, FormSubmit.co kullanılıyor; bkz. İletişim
sayfasındaki aynı desen.)*

**Title:** Olay Müdahale Hattı | DERESYS
**Meta description:** Abonelik modeliyle sunulacak olay müdahale hattı. Hazırlık aşamasında.

### H1
Olay müdahale hattı

### Açılış
Abonelik modeliyle sunulacak olay müdahale hattı üzerinde çalışıyoruz.
Hat henüz açık değil.

Bunu açıkça yazıyoruz, çünkü olay anında arayacağınız bir numaranın
cevap verip vermeyeceği tahmin edilebilecek bir konu değil. Bu arada
bize doğrudan yazmak isterseniz info@deresys.com.tr adresinden
ulaşabilirsiniz.

### H2 — Hat açıldığında haber verelim
Hizmet devreye girdiğinde bilgilendirilmek isterseniz e-posta adresinizi
bırakabilirsiniz.

[E-posta formu — info@deresys.com.tr'ye gönderir, FormSubmit.co]
[Buton: Haberdar et]

### H2 — Bu arada
Bir müdahale hattı, kurum içi hazırlığın yerini tutmuyor. Süreçler ve
roller tanımlı değilse hattan alınacak fayda da sınırlı kalıyor. Hazırlık
tarafında bugün yapılabilecekler için:
[Bağlantı: Olay Müdahalesi]

---

## 14. KVKK Aydınlatma Metni — `/kvkk`

*(Değişmedi. Bkz. sürüm 2.)*

> Sayfanın tamamı [DOLDURULACAK].
>
> Hukuki metindir, taslak yazılmaz. CONTEXT.md bölüm 9'a göre şu bilgiler
> olmadan hazırlanamaz: ticari unvan, açık adres, MERSIS numarası, veri
> sorumlusu iletişim bilgisi.
>
> Ayrıca netleştirilmeli: form verisinin nerede saklandığı, saklama süresi
> ve varsa yurt dışına aktarım durumu.

---

## 15. 404

*(Değişmedi, yalnızca "Çözümler" bağlantı metni "Hizmetler" oldu.)*

### H1
Bu sayfa bulunamadı

### Metin
Aradığınız sayfa taşınmış veya adres yanlış yazılmış olabilir.

[Bağlantı: Ana sayfa] · [Bağlantı: Hizmetler] · [Bağlantı: Blog]

---

## Yazım kuralları

**Gerçeklik**
- Referans, müşteri sayısı, proje sayısı, deneyim yılı veya benzeri metrik
  yazılmaz. Bu veriler CONTEXT.md'de doğrulanmamıştır.
- Hotline için yanıt süresi, 7/24 erişim veya SLA taahhüdü yazılmaz.
- Ekip büyüklüğü veya eşzamanlı kapasite ima edilmez. "Ekibimiz" yerine
  "DERESYS" öznesi ya da birinci çoğul fiil kullanılır.
- Kamu kurumları ve kritik altyapı hedef segment olarak yazılmaz; sektör
  kısıtlaması da belirtilmez.

**Biçim**
- Marka adı gövde metninde büyük harf: `DERESYS`.
- İngilizce siber güvenlik terimleri Türkçeleştirilmez: SOC, SIEM, EDR,
  MSSP, MITRE ATT&CK, NIST CSF, incident response.
- Tagline yalnızca metin olarak dizilir, görsel olarak kullanılmaz.

**Üslup**
- Okuyucu, işini bilen bir yönetici olarak kabul edilir. Temel kavramlar
  açıklanmaz, sonuç çıkarımı okuyucuya bırakılır.
- "X değil, Y" karşıtlık kalıbı sayfa başına en fazla bir kez kullanılır.
- Atasözü, benzetme ve aforizma kullanılmaz.
- Bağımsızlık ilkesi sitede yalnızca iki yerde geçer: Hakkında sayfasında
  bir madde, Ürünler sayfasında bir cümle. Başka sayfada tekrarlanmaz.
- Bir hizmetin ne işe yaradığı, hangi durumda uygun olduğu anlatılarak
  gösterilir; üstünlük iddiasıyla değil.
