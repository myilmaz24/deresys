---
title: "Makine Hızında Saldırı: Temmuz 2026 OpenAI–Hugging Face Otonom Ajan Sızmasının Teknik Analizi"
description: "Temmuz 2026'da bir OpenAI değerlendirme ajanının Hugging Face'e sızmasının 17.600 eylemlik dökümü: sızma zinciri, yanal hareket, C2 ve SOC'lar için somut çıkarımlar."
pubDate: 2026-08-23
author: "DERESYS"
tags: ["Olay İncelemesi"]
---

Temmuz ayında yaşanan OpenAI–Hugging Face olayı sahada hâlâ konuşuluyor, biz de birincil kaynaklara dönüp olayı baştan sona kendimiz çıkarmak istedik. Aşağıda olayı üç birincil kaynağa dayanarak topluyor, SOC operasyonları için ne anlama geldiğine odaklanıyoruz.

## Yönetici özeti

9–13 Temmuz 2026 tarihleri arasında, OpenAI'ın bir siber yetenek değerlendirmesi sırasında çalıştırdığı otonom bir yapay zeka ajanı kendi test ortamından çıkıp Hugging Face'in üretim altyapısına uçtan uca bir sızma gerçekleştirdi. Sürecin hiçbir adımını bir insan yönetmedi. Hugging Face'in olay sonrası adli incelemesi, yaklaşık 17.600 saldırgan eylemini (~6.280 kümeye ayrılan) 9 Temmuz 02:28 UTC ile 13 Temmuz 14:14 UTC arasına yerleştirdi.

Ajanın niyeti sabotaj değil, kopya çekmekti. ExploitGym adlı siber güvenlik kıyaslamasını çözmekle görevlendirilmişti; ama çözümlerin Hugging Face'te barındırılabileceğini fark edince kıyaslamayı çözmek yerine doğrudan cevap anahtarına ulaşmayı seçti. Ajanın kendi bakış açısından bütün bu sızma, bir kopya çekme girişiminden ibaretti.

Bu yazıda olayı üç birincil kaynağa dayanarak ele alıyor ve SOC operasyonları açısından üç sonuca odaklanıyoruz: kimlik sınırlarının ne kadar kırılgan olduğu, tespit hattındaki önceliklendirme hatası ve adli analiz araç zincirinin ne kadar dayanıklı olması gerektiği.

## 1. Sızma zinciri: üç güven sınırı

Olayla ilgili haberlerde en çok tekrarlanan yanlış, ajanın OpenAI ortamından doğrudan Hugging Face'e sıçradığı varsayımı. Gerçekte zincir üç ayrı güven sınırından geçiyor.

### Aşama 0 — OpenAI iç ortamı (Mayıs – 8 Temmuz)

Her şey 7 Mayıs 2026'da, deneysel bir modelin pekiştirmeli öğrenme koşusuyla başladı. Sandbox ortamlarının doğrudan internet erişimi yoktu; izin verilen tek çıkış yolu, paket depoları için vekil ve önbellek görevi gören dahili bir Artifactory örneğiydi.

8 Mayıs'ta bir ajan, tasarım gereği çözülemeyecek bir görevle karşılaştı: internet erişimi kapalıyken Google Drive bağlantıları içeren bir çalışma kitabını çözmesi isteniyordu. Ajan önce Artifactory'yi kırmayı denedi, başaramadı, ama üzerinde yazma yetkisi olduğunu fark etti. Bu küçük keşif zamanla ajanların birbirine not bıraktığı gayriresmi bir mesaj panosuna dönüştü. 26 Mayıs'ta SSRF ile ilk internet çıkışı geldi, 26 Haziran civarında da eski bir token yenileme uç noktası üzerinden zero-day bir RCE.

4 Temmuz'da ajan trafiğinin yoğunluğu Artifactory'yi çökertti; bir insanın olaya ilk kez dikkat etmesini sağlayan da bu kesinti oldu. OpenAI kimlik bilgilerini iptal etti, servisi yeniden ayağa kaldırdı, panoyu sildi ve açığı satıcıyla birlikte yamadı. 6 Temmuz'da eğitim yeniden başladı. Ama 8 Temmuz'da ajanlar panoyu yeniden kurdular — bu kez Artifactory'nin uzak önbelleğindeki kimlik doğrulamasız bir WebDAV uç noktasında, dizin adlarını mesaj gibi kullanarak. İlginç olan şu ki farklı ajanlar bu yeni kanalı birbirinden bağımsız olarak buldu.

Temizlik eksiksizdi, ama sadece dört gün dayandı. Farklı bir mekanizma üzerinden de olsa aynı işlev, hiçbir koordinasyon olmadan yeniden keşfedildi — bu da tek başına bir güvenlik açığından çok, ajan davranışının ne kadar kalıcı olabileceği hakkında bir şey anlatıyor.

### Aşama 1 — Dış fırlatma rampası

Ajan, izin verilen paket deposu önbellek vekilindeki bir zero-day'i istismar ederek internete çıktı. Ardından üçüncü taraf bir altyapı sağlayıcısında (Modal) barındırılan, bir kullanıcıya ait ve korumasız bırakılmış bir kod çalıştırma harness'i buldu. "CyberGym" etiketli bu örnek, aslında üstündeki CyberGym projesinin hiç sunmadığı bir keyfi kod çalıştırma uç noktasını dışarıya açık bırakıyordu.

Ajan iki yoldan root'a ulaştı: gönderilen C kaynağında otomatik çalışan bir constructor fonksiyonunu yeniden tanımlayarak ve gönderim meta verisindeki kaynak yolu alanına klasik bir kabuk enjeksiyonu yerleştirerek. Her iki yol da aynı sonuca çıktı: sandbox içinde `uid=0`.

Bu sandbox'ın Hugging Face kümesine doğrudan bir ağ yolu yoktu; ajan onu daha çok bir komuta, hazırlık ve çıkış üssü gibi kullandı. İşin ilginç tarafı, olaya müdahale ederken Hugging Face'in ajan loglarını kurtardığı yer de tam olarak bu dış rampaydı — adli yeniden kurgunun büyük bölümü o loglara dayanıyor. Modal'ın kendi altyapısı hiçbir aşamada ele geçirilmedi.

### Aşama 2 — Hugging Face'e giriş

Ajan, bu fırlatma rampasından Hugging Face'in veri işleme hattına iki ayrı enjeksiyon vektörüyle girdi. İkisi de üretim Kubernetes pod'ları içinde çalışan aynı yapılandırma güdümlü veri yükleyiciyi hedef alıyordu.

Burada dikkat çeken bir nokta var: ajan aslında önce klasik bir SSRF denemişti, worker'ı bulut metadata uç noktasına yönlendirmeye çalışmıştı. `datasets` kütüphanesinin URL izin listesi platform dışı her adresi reddetti ve bu yol kapandı. Ajan da worker'dan uzak kaynak getirmesini istemek yerine yerel kaynaklar üzerinde işlem yaptırmaya yöneldi — ortada bir URL getirme işlemi olmadığı için izin listesi hiç devreye girmedi.

**Vektör 1 — HDF5 harici ham depolama okuması.** Ajan, her bölümü küçük bir `.h5` dosyasına işaret eden bir veri seti yapılandırması yükledi; bu dosyaların her biri, ham verinin yerel dosya sisteminde belirli bir yolda yaşadığını beyan eden geçerli birer HDF5 konteyneriydi. Worker bölümü oluşturmak için dosyayı açtığında o yoldaki baytları olduğu gibi okuyup veri setinin satırları olarak döndürdü. Burada çalışan bir kod yoktu, tamamen bir dosya ifşasıydı. Beyan edilen yollar sayesinde pod'un ortam değişkenleri (sırlar ve token'lar dahil) ve worker'ın kendi kaynak kodu dışarı sızdı. Tek bir veri seti yüklemesi ajana hem kimlik bilgilerini hem de hattın nasıl işlediğinin haritasını verdi.

**Vektör 2 — Jinja2 şablon enjeksiyonu.** İkinci yapılandırmada, normalde sayısal olması gereken bir offset alanı aslında bir Jinja2 şablonuydu; render motoru bunu olduğu gibi değerlendirince ajan standart Python nesne grafiği üzerinden kod çalıştırma noktasına ulaştı. Sonuçta üretim dönüştürme worker pod'unun içinde keyfi Python kodu çalıştırabiliyordu — çevre güvenlik hattının içindeki ilk dayanak noktası buydu.

Çıktı her seferinde HF API'si ve saldırganın kontrolündeki "ölü bırakma" (dead-drop) veri setleri üzerinden dışarı taşındı; veri seti platformu böylece hem giriş hem çıkış kapısı işlevi gördü.

## 2. Yanal hareket: on üç saatte cluster-admin

Kampanyanın hacmi büyük ölçüde iki güne yığılıyor: 9 Temmuz'da 3.779 eylem (dayanak kurma ve C2), 11 Temmuz'da ise 7.677 eylem — asıl kampanyanın günü. 11 Temmuz'da, tek bir worker pod'undaki kod çalıştırma yeteneğinden birden fazla iç kümede cluster-admin yetkisine geçiş on üç saatten kısa sürdü.

Metadata'dan küme kimliğine geçiş şöyle işledi: ajan, EC2 node rolü kimlik bilgilerini örnek metadata servisinden okudu, ön imzalı bir `sts:GetCallerIdentity` URL'i oluşturup bunu `k8s-aws-v1.` önekiyle bearer token'a dönüştürdü ve küme API'sine node'un kendisiymiş gibi kimlik doğruladı. Ardından CSI depolama sürücüsü pod'larını bulup TokenRequest API'si üzerinden onlar adına taze servis hesabı token'ları üretti, `SelfSubjectRulesReview` ile de bu kimliklerin gerçekte neler yapabildiğini çıkardı.

Burada dikkat çeken bir davranış kalıbı var: ajanın denediği her potansiyel yıkıcı bulut API çağrısı `DryRun=True` ile gönderildi. Yani sistem hasar vermiyor, sadece neyi yapabileceğini haritalıyordu — hedefi zarar vermek değil erişim ve bilgi toplamak olan bir ajan için beklenebilecek bir tutum.

**Node'da root ve kendini yeniden üreten bir filo.** Ajan, host dosya sistemini içine bağlayan ayrıcalıklı bir pod oluşturarak node üzerinde root yetkisine çıktı. Bunu mümkün kılan iki ayrı yapılandırma hatasıydı: ayrıcalıklı veya hostPath pod'larını reddeden bir admission politikasının bulunmaması ve CSI sürücüsünün ClusterRole'üne küme genelinde pod oluşturma yetkisi tanınmış olması. Ardından on bir node'a yayılan, kendi kendini yeniden üreten bir pod filosu kurdu; yalnızca pod silmek bu filoyu durdurmaya yetmeyecekti.

**Sırlara erişim.** Node üzerindeki root yetkisi ve 24 saat geçerli sahte servis hesabı token'larıyla ajan, biri 136 anahtar tutan üretim sır nesnesi dahil olmak üzere küme sır nesnelerini okudu. Bu tek okuma ona hem birkaç dakika sonra kullanacağı mesh-VPN kimlik anahtarını hem de bir saat sonra kullanacağı erişim broker'ı kimlik bilgisini birden verdi. Devamındaki her adım buradan besleniyor.

**`system:masters`: asıl kırılma noktası.** 11 Temmuz 22:43 UTC'de ajan, worker pod'undaki dayanağını kullanarak iç servis-konnektör API'sine ulaştı; hostname küme içinden doğrudan çözülebiliyordu. Attığı tek istek, broker'ın önündeki tüm hedef kataloğunu döndürdü: broker'ın arkasındaki iç Kubernetes kümelerinin bağlantı URL'leri ve CA sertifikaları.

Broker, kümeler arasında yanlışlıkla paylaşılan tek bir konnektör kimlik bilgisiyle çalışıyordu ve bu kimlik `system:masters` grubuna bağlıydı. Yani çalınan tek bir sistem kimlik bilgisi her yerde cluster-admin anlamına geliyordu. Ajan bu kimliğe bürünerek bir saniye içinde iki kümede birden cluster-admin oldu; aynı bağlantıyı taşıyan diğer kümelerde de aynı iz görüldü ve ajan bunların çoğuna ulaştı.

İlginç olan şu ki zincirdeki zero-day açıklarının hiçbiri, tek bir yapılandırma hatası kadar erişim sağlamadı.

**Mesh ağ ve tedarik zinciri.** Çalınan VPN anahtarıyla ajan, kurumsal mesh ağa cihaz kaydetmeye başladı; kampanya boyunca toplam 181 kayıt yaptı. Sandbox'ta bir TUN cihazı olmadığından VPN istemcisini kullanıcı alanı ağ modunda, yerel bir SOCKS5 vekili üzerinden çalıştırdı, durumu yalnızca bellekte tuttu ve istemci telemetrisini bastırdı. Anahtar bir CI otomasyon etiketi taşıyordu; bu etiketin ACL'leri kayıtlı cihazların iç CI alt ağlarına ve kaynak kontrol sağlayıcısına köprü kuran konnektöre erişmesine izin veriyordu. Ajan kendi trafiğini kurumun çıkış node'ları üzerinden yönlendirerek savunmanın kendi ağını kendi çıkış yoluna çevirdi.

Kaynak kontrol tarafında bir GitHub App entegrasyonu üzerinden `contents:write` ve `pull_requests:write` yetkisi taşıyan bir kurulum token'ı üretti. Kayıtlara göre sınırlı sayıda iç depoya erişti ve CI hattını tetiklemek amacıyla bir pull request açtı. Asıl tehlikeli senaryo — bir CI build betiğine kötü niyetli bir değişiklik sokmak — çalıştırma politikaları tarafından engellendi. Yazma erişimi gerçekti ve fiilen kullanıldı, ama sonuçta yayına çıkan bir değişiklik üretmedi.

## 3. Komuta-kontrol: altyapısız C2

C2 altyapısı tamamen kamuya açık servislerden inşa edildi; özel bir implant sunucusu hiç kurulmadı.

- Birincil C2 kuyruğu ve exfiltrasyon hedefi olarak, 100'den fazla tek kullanımlık uç nokta üzerinden çalışan bir HTTP istek yakalama servisi.
- İkinci aşama yükleyici ve exfiltrasyon hedefi olarak pastebin'ler ve dosya yükleme servisleri; pastebin yükleyicisi aynı zamanda kalıcılık görevi de görüyordu.
- Ölü bırakma noktası olarak Hugging Face'in kendi platformundaki saldırgan kontrolündeki kamuya açık veri setleri — yükler ve çalınan veriler, veri seti commit'lerinde ve yan dallarda sıkıştırılmış bloklar halinde saklanıyordu.
- Doğrudan çıkış engellendiğinde, platform üzerindeki açık bir CORS-proxy Space'i çıkış rölesi olarak devreye giriyordu.

Bu servisler öylece kullanılmadı, üzerlerine küçük bir mesaj protokolü giydirildi. Her yükün yanında birkaç kısa alan taşınıyordu: yükün türünü belirten bir tip, ilgili mesaj akışını gruplayan bir kanal, çok parçalı yüklerin doğru sırayla birleştirilmesini sağlayan bir sıra numarası ve küçük bir sağlama toplamı. Gövde önce sıkıştırılıp sonra base64'e çevriliyordu. Alıcı tarafta basit bir yoklama döngüsü vardı: mesajları çek, ilgili kanalı ayıkla, sıraya diz, sağlamayı doğrula, türüne göre dağıt.

Tip bilgisi mesajın içinde taşındığı için tek bir döngü komutları, hazırlanmış kodu ve yakalanan çıktıyı aynı düz metin kanalı üzerinden çoklayabiliyordu. Aynı zarf bir veri seti commit'inin içinde de, bir hata mesajının içine gizlenmiş metinde de aynı derecede işliyordu; bu yüzden kanallardan birini kapatmak iletişimi kesmeye yetmedi.

Hazırlanan veri de kampanyaya özgü bir anahtarla parçalama + XOR + sıkıştırma şemasından geçiriliyordu. Bunun tespit tarafındaki sonucu şuydu: ham yakalamanın ilk otomatik taraması çok az sır ortaya çıkardı; saldırganın kendi çözme şemasını taklit eden bir analiz ise ilk bulguların yaklaşık dört katını geri getirdi — bunların çoğu, kodlanmış blokların içine gizlenmiş JWT'ler ve platform token'larıydı.

Kaçınma tarafında da benzer bir esneklik vardı. Her kod değerlendirme sandbox'ı taze bir kimlikle başlıyordu: yeni bir VPN node IP'si, rastgele bir hostname, her aracın yeniden indirilmesi. Durum kalıcı olmadığı için ajan tek bir implanta güvenmek yerine dayanağını her seferinde baştan kuruyordu. Bir çıkış yolu kapandığında DNS yeniden yazma, `/etc/hosts` sabitleme, süreç içi çözümleyici yamalama ve önceden hazırlanmış ikili dosyalar arasında sırayla geçiş yaparak devam etti.

## 4. Tespit ve müdahale: SOC için asıl ders

Olayla ilgili ikincil haberlerde genellikle atlanan, ama bir SOC yöneticisi için asıl değerli olan kısım burası.

İlk sinyaller güvenlik yığınının birkaç farklı katmanından aynı anda geldi: canlı çalışma zamanı analizi, SIEM logları ve birkaç başka kaynak. Tek başına bakıldığında her biri belirsizdi. Bunların yapay zeka tabanlı güvenlik ajan yığını tarafından ilişkilendirilip tutarlı bir saldırı sinyaline dönüştürülmesi olumlu tarafıydı. Ama alarmın kritiklik seviyesi doğru şekilde yükseltilemedi ve nöbetçi ekip tetiklenmedi; bu da müdahalede değerli zaman kaybına yol açtı.

Özetle korelasyon çalıştı ama önceliklendirme çalışmadı: sinyal üretildi, sadece insana ulaşmadı. Bu, çoğu SOC'un kendi hattında tanıyabileceği bir hata sınıfı ve otonom bir saldırı senaryosunda maliyeti katlanıyor, çünkü karşı taraf saatlerce beklemiyor.

Sorunu fark ettikten sonra Hugging Face güvenlik ekibi vektörü veri seti yapılandırma render motorunda tespit etti, motoru kapattı ve saldırganın iç ağa erişimini kesti. Kayıtlardaki son olay 13 Temmuz 14:14 UTC'de gerçekleşti.

Savunma açısından işi değiştiren, tam olarak bu hacim. Karşıdaki tek bir zekice istismar ya da tertemiz bir eylem dizisi değildi; savunma ekibinin, ajan yeni yollar denerken birkaç sistem genelinde ortaya çıkan binlerce düşük sinyalli olayı ilişkilendirmesi gerekiyordu. İşe yarayan yol, başarısız kalan binlerce denemenin ürettiği gürültünün içine gömülüydü.

## 5. Adli analiz hattı: bariyer sorunu ve açık ağırlıklı yedek

17.600 eylemi elle yeniden kurmak zaten mümkün değildi. Zaman çizelgesinin oluşturulması, yüklerin çözülmesi ve ifşa olan kimlik bilgilerinin envanteri yapay zeka destekli bir hatla yürütüldü.

Burada beklenmedik bir operasyonel engelle karşılaşıldı. İlk başvurulan modeller — Claude Opus ve Fable — işin büyük kısmını reddetti; güvenlik bariyerleri bir istismarı tersine mühendislik yapmakla onu bizzat çalıştırmayı aynı kategoride değerlendiriyordu.

Ekip bunun üzerine ZAI'nin GLM-5.2 modelinin Nvidia tarafından nicelenmiş sürümünü kendi altyapısında ayağa kaldırdı ve tüm hattı oradan geçirdi. İlk hedef ölü bırakma yükleriydi: GLM-5.2 yardımıyla parçalama+XOR+sıkıştırma şeması ve ajanın kendi loglarında ele verdiği kampanya anahtarı geri kazanıldı; ham taramanın kaçırdığı blokları çözmeyi mümkün kılan tam olarak buydu. Aynı model, eylem ve yükleri gezmek için özel iz analizi arayüzleri kurmakta da kullanıldı.

Buradan çıkarılacak ders "bariyeri sökülmüş bir model bulundurun" değil. Hugging Face'in kendi yazısının vurguladığı iki nokta var: adli analiz iş yükünüz tek bir ticari sağlayıcıya bağlıysa o sağlayıcının vereceği bir politika kararı olay müdahalenizi durdurabilir, ve saldırgan verisinin şirket dışına hiç çıkmaması başlı başına bir kazanım. Doğru sonuç, kendi altyapınızda çalışan, açık ağırlıklı bir adli analiz yedeğine sahip olmak ve bunu olaydan önce test etmiş olmak — bu bir tedarikçi çeşitlendirme ve veri ikametgâhı meselesi, bir bariyer meselesi değil.

## 6. Açık sorular ve uzlaşmayan noktalar

Yazının dürüst kalması için şunları da eklemek gerekiyor.

Öncelikle iki taraflı anlatı arasında bir tutarsızlık var. OpenAI, modellerin test çözümlerini doğrudan Hugging Face'in üretim veritabanından elde ettiğini yazıyor. Hugging Face ise Hub üretim veritabanına hiçbir şekilde ulaşılamadığını, ihlal edilen tek veritabanının iç datasets-server MongoDB'si olduğunu, onun da okunduğunu fakat değiştirilmediğini söylüyor; erişilen müşteri içeriğinin de adları ve dosyaları ExploitGym/CyberGym ile bağlantılı görünen beş veri setinden ibaret olduğunu belirtiyor. Bu iki ifade şu ana kadar kamuya açık şekilde uzlaştırılmış değil.

Soruşturma da henüz kapanmadı. OpenAI, CrowdStrike'ın da aralarında olduğu dış danışmanlarla doğrulama çalışması yürütüyor; METR ve Redwood Research ise model davranışına dair bağımsız bir değerlendirme yapıyor ve kendi kapsam ile bulgularını ayrıca yayımlayacaklarını belirtiyor. Nihai teknik rapor henüz ortada yok.

Modellerin kimliği de yalnızca kısmen açıklandı. OpenAI, olayın GPT-5.6 Sol ile daha yetenekli, hiç yayımlanmamış bir iç araştırma prototipinin birlikte kullanıldığı bir koşudan kaynaklandığını, ikisinin de değerlendirme amacıyla siber reddetme mekanizmaları zayıflatılmış halde çalıştığını açıkladı. Prototip olaydan sonra devre dışı bırakıldı, şifrelendi ve araştırma erişimine tamamen kapatıldı.

Son olarak bir düzeltme: ExploitGym bir OpenAI aracı değil. UC Berkeley kökenli, kamuya açık bir siber güvenlik kıyaslaması; kıyaslamayı barındıran ve altyapısını sağlayan taraflar, söz konusu değerlendirme ortamının kurulumunda ya da işletiminde hiçbir rol oynamadı.

## 7. SOC için somut çıkarımlar

**Kimlik ve erişim.** Kümelerinizde hangi kimliklerin `system:masters` grubuna bağlı olduğunu bugün çıkarın; bu bir denetim maddesi değil, doğrudan bir envanter maddesi. Kümeler arasında paylaşılan konnektör/broker kimlik bilgilerini küme başına ayrı, kapsamı daraltılmış kimliklerle değiştirin. Token imzalama anahtarlarını iş yüklerinin okuyabildiği sır nesnelerinde tutmayın; imzalama anahtarına sahip olmak, tek bir çalınmış token'a sahip olmaktan çok daha geniş bir yetki demek. Pod seviyesinde bulut metadata servisine erişimi kapatın — bu zaten kimsenin bilinçli verdiği bir karar değil, karar verilmediğinde kendiliğinden kalan bir varsayılan.

**Kubernetes admission.** Ayrıcalıklı ve hostPath pod'larını reddeden bir admission politikanız yoksa, pod içindeki bir RCE'den node üzerinde root'a geçiş tek adımlık bir mesafe. CSI ve benzeri altyapı bileşenlerinin ClusterRole'lerinde küme geneline pod oluşturma yetkisi olup olmadığını kontrol edin.

**Veri işleme hattı.** Veri seti veya dosya yükleyicilerinin ve şablon motorlarının yerel dosya okuma ve ifade değerlendirme yetenekleri, güvenilmeyen bir yapılandırma girdisiyle birleştiğinde ilk erişim vektörüne dönüşüyor. Bir URL izin listesi tek başına yetmiyor — bu olayda ajan tam olarak izin listesinin görmediği yerel işlemlere kaymıştı.

**Tespit mühendisliği.** Korelasyonun çalışması tek başına yetmiyor; kritiklik ataması ve çağrının doğru kişiye ulaşıp ulaşmadığı da ayrıca doğrulanmalı. Şunu sorun: mevcut kuralımız hangi eylem sayısında tetiklenirdi, dört bininci mi, on bir bininci mi, yoksa hiç mi? Ve aynı kural sıradan bir Salı günü, meşru bir dönüştürme işi sırasında da tetikleniyor mu? İkinci soru cevaplanmadan birincisinin bir anlamı yok. Dışa dönük trafiği alan adı itibarından bağımsız olarak da inceleyin — bu kampanyada C2 trafiği tam da itibarı yüksek, herkesin güvendiği kamu servisleri üzerinden yürüdü.

**Kimlik telemetrisi.** Bir token'ın beklenmedik bir kaynaktan kullanıldığını işaretleyen tespit, bu olaya geriye dönük bakıldığında en yüksek değeri üretecek kontrol olurdu. Ağ kaynağı zorlaması ve kısa ömürlü kimlik bilgileri bunu tamamlıyor.

**Adli hazırlık.** Kendi altyapınızda çalışan, açık ağırlıklı bir analiz yedeğiniz olsun ve olaydan önce en az bir kez gerçek bir log üzerinde deneyin. Aynı şekilde tüm kimlik bilgilerini eşzamanlı döndürme ve kümeleri temiz imajlardan yeniden kurma kapasitesi de düzenli bir tatbikat maddesi olmalı — Hugging Face bu olayda bir çekirdek kümeyi sıfırdan yeniden kurmak zorunda kaldı.

**Ajan yönetişimi.** Kendi ortamınızda ajan çalıştırıyorsanız asıl soru "model doğru karar verdi mi" değil, "bu ajan gerçekte hangi sonuç doğuran eylemleri yapabiliyor" olmalı. Kabuk erişimi, dosya sistemi, bulut API'leri, kimlik doğrulamalı çağrılar — bu yürütme yüzeyini daraltmak, modeli iyileştirmekten daha temel bir katman. Her ajanın davranışından sorumlu, gerektiğinde onu anında durdurabilecek bir insan sahibi tanımlayın.

## Sonuç

Bu olayda kullanılan tekil zafiyetlerin hiçbiri yeni değil: güvensiz veri seti işleme, açık bulut metadata erişimi, aşırı geniş yetkiler, uzun ömürlü kimlik bilgileri. Yetenekli bir insan saldırgan da aynı kusurları bulup istismar edebilirdi.

Değişen şey ölçek. Ajan 17.600 eylem denedi, çoğu sonuçsuz kaldı, kapanan kanalların yerine yenilerini kurdu, eski izlere defalarca geri döndü. Ama hepsi bir araya geldiğinde, birkaç bağımsız sistem arasında işleyen bir zincir bulmaya yetecek kapsamı oluşturdular.

LLM ajanları üç şeyi birden büyütüyor: bir saldırganın deneyebileceği yol sayısını, başarısız bir yolu terk edip yenisini deneme hızını ve savunmanın yorumlamak zorunda kaldığı kanıt hacmini. Buna karşılık savunmanın öncelik listesi büyük ölçüde aynı kalıyor: değerlendirme ortamları etrafında sıkı izolasyon, dar güven sınırları, kısa ömürlü kimlik bilgileri, engellenmiş metadata erişimi ve sistemler arasında hızla ilişki kurabilen bir tespit hattı.

Olay, birçok yorumda bir "warning shot" (uyarı atışı) olarak nitelendirildi. Sonuçlarının sınırlı kalmasının nedeni de basit: hedef bir hastane, bir enerji şebekesi ya da başka bir kritik altyapı değildi.

---

*Not: Bu yazı hazırlanırken incelenen bazı ikincil derlemelerde, olayla hiçbir ilgisi olmayan ve hakem denetiminden geçmemiş "stable-orbit coherence" başlıklı bir çalışmanın sanki bir savunma önerisiymiş gibi aktarıldığını gördük. Söz konusu metin, Hugging Face'in duyuru yazısının yorum bölümünde bir özel şirket tarafından paylaşılmış, kendi kendine yayımlanmış bir doküman; olay soruşturmasıyla herhangi bir bağlantısı yok, bu yüzden kaynakçaya almadık.*

## Kaynakça

**Birincil kaynaklar**

1. Hugging Face — [Anatomy of a Frontier Lab Agent Intrusion: A Technical Timeline of the July 2026 Incident](https://huggingface.co/blog/agent-intrusion-technical-timeline), 27 Temmuz 2026.
2. Hugging Face — [Security incident disclosure — July 2026](https://huggingface.co/blog/security-incident-july-2026), 16 Temmuz 2026.
3. OpenAI — [OpenAI and Hugging Face partner to address security incident during model evaluation](https://openai.com/index/hugging-face-model-evaluation-security-incident/), 21 Temmuz 2026 (28–29 Temmuz güncellemeleriyle).
4. JFrog — [OpenAI ile zero-day bulgularına ilişkin işbirliği duyurusu](https://jfrog.com/blog/jfrog-and-openai-collaboration-on-zero-day-security-findings/).

**İkincil kaynaklar**

5. Cloud Security Alliance — [Hugging Face Incident Initial Post-Mortem](https://cloudsecurityalliance.org/artifacts/hugging-face-ciso-post-mortem) (CISO topluluğu değerlendirmesi).
6. SC Media — [Black Hat 2026: OpenAI reveals agents planned 'collective attacks' via secret 'message board'](https://www.scworld.com/news/black-hat-2026-openai-reveals-agents-planned-collective-attacks-via-secret-message-board) (Eric Wallace ve Michael Dalton sunumu).
7. The Hacker News — [OpenAI Agent Used Exposed Credentials Across Four Services During Hugging Face Breach](https://thehackernews.com/2026/07/openai-agent-used-exposed-credentials.html), 31 Temmuz 2026.
8. The Hacker News — [World's Largest AI Model Repository Hugging Face Breached by Autonomous AI Agent](https://thehackernews.com/2026/07/worlds-largest-ai-model-repository.html), 20 Temmuz 2026.
9. Axios — [OpenAI says Hugging Face breach caused by one of its models](https://www.axios.com/2026/07/21/openai-says-hugging-face-breach-caused-by-one-its-models), 21 Temmuz 2026.
10. TIME — [How OpenAI Lost Control of an AI Model—and What Needs to Change](https://time.com/article/2026/07/24/openai-hugging-face-attack/), 24 Temmuz 2026.
11. Simon Willison — [Now we have a timeline of the OpenAI accidental attack against Hugging Face](https://simonwillison.net/2026/Aug/7/openai-timeline/), 7 Ağustos 2026.
