// Hizmet sayfası içerikleri. Marka adı, fiyat, SLA/yanıt süresi, kapasite ve referans içermez.
// Markalar yalnızca SupportedTechnologies bileşeninde yer alır.

export const siem = {
  image: '/cozumler/siem.webp',
  imageAlt: 'Log akışlarının merkezi bir veri deposunda toplandığı, büyük ekranlı turuncu tonlarda bir güvenlik operasyon odası',
  metaTitle: 'SIEM Kurulum, İşletim ve Kural Geliştirme',
  description: 'Kurumsal SIEM platformları için on-prem kurulum, sürekli işletim ve MITRE ATT&CK bazlı kural danışmanlığı.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'SIEM kurulum, işletim ve kural geliştirme',
  lead: 'Kurumsal SIEM platformunuzun kurulumunu, günlük işletimini ve tespit kurallarının geliştirilmesini yürütürüz. Üç bileşen ayrı ayrı alınabilir; doğal sırası kurulum, ardından işletim ve kural danışmanlığıdır.',
  componentsTitle: 'Üç bileşen',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum (on-prem)',
      body: 'Yeni bir SIEM ortamının mimarisinin tasarlanması, kurulması ve ilk log kaynaklarıyla devreye alınması: ihtiyaç analizi, sizing, indeks ve veri modeli tasarımı, log toplayıcı dağıtımı, parsing ve normalizasyon, kabul testi ve devir teslim. Devreye alma sonrasında kısa süreli yoğun destek (hypercare) verilir.',
      fit: 'Yalnızca on-prem dağıtımlar kapsamdadır. Bulut tabanlı kurulum bu paketin dışındadır.',
    },
    {
      code: 'Bileşen B',
      title: 'İşletim (sürekli destek)',
      body: 'Kurulu bir platformun sağlığının, güncelliğinin ve yapılandırma bütünlüğünün korunması: periyodik sağlık kontrolü, planlı pencerede güncelleme, kapasite ve lisans gözden geçirmesi, log kaynağı kesinti takibi, değişiklik kaydı ve destek talepleri. Platform Deresys tarafından kurulmuş olabilir ya da mevcut bir ortam olabilir.',
      fit: 'MSS, platformdan gelen güvenlik olaylarını ve kuralları izler; bu bileşen platformun kendisiyle — indexer, arama katmanı, lisans, disk, sürüm — ilgilenir. İkisi bağımsız alınabilir ya da birlikte yürütülebilir.',
    },
    {
      code: 'Bileşen C',
      title: 'Kural Danışmanlığı',
      body: 'Ortamdaki correlation rule, alert ve saved search envanterinin MITRE ATT&CK çerçevesine göre değerlendirilmesi, kalite ve kapsam boşluklarının çıkarılması ve önceliklendirilmiş bir iyileştirme raporu hazırlanması.',
      fit: 'İki alt paket vardır. Temel Paket: öneri ve rapor; Deresys yazma erişimi istemez, iyileştirmeyi kendi ekibiniz uygular. Üst Paket: danışmanlık ve uygulama; yalnızca kural seviyesinde, müşteri onayı ve değişiklik kaydıyla sınırlı yazma erişimi verilir.',
    },
  ],
  outputs: [
    { name: 'Mimari tasarım dokümanı ve devir teslim paketi', body: 'Kurulum bileşeninde' },
    { name: 'Sağlık kontrol notları ve aylık işletim raporu', body: 'İşletim bileşeninde' },
    { name: 'MITRE ATT&CK kapsam haritası ve kalite skor tablosu', body: 'Kural Danışmanlığı bileşeninde' },
    { name: 'Önceliklendirilmiş iyileştirme raporu', body: 'Temel Paket’te teslim edilen; Üst Paket’te uygulanan kural seti ve değişiklik kaydıyla birlikte' },
  ],
  fit: 'On-prem SIEM kullanan veya kullanmaya karar vermiş, ama platformu sağlıklı tutacak ya da tespit içeriğini geliştirecek uzmanlık kapasitesi sınırlı olan kurumlar için. MSS müşterisi olmanız gerekmez.',
};

export const edrNdr = {
  image: '/cozumler/edr-ndr.webp',
  imageAlt: 'Dünya haritası üzerinde birbirine bağlı uç noktalar, sunucular ve uyarı işaretleri; radar ve izleme panelleri',
  metaTitle: 'EDR / NDR Kurulum ve İşletim',
  description: 'Uç nokta (EDR) ve ağ (NDR) tespit platformları için devreye alma, politika yönetimi, kapsam takibi ve tespit ayarlama.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'EDR / NDR kurulum ve işletim',
  lead: 'Uç nokta ve ağ tespit platformlarınızın devreye alınması, politika ve kapsam yönetimi ve tespit kalitesinin ayarlanması. Üç bileşen ayrı ayrı alınabilir.',
  componentsTitle: 'Üç bileşen',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum',
      body: 'EDR ajanı ve NDR sensörü dağıtım planı, pilot grup, politika tasarımı, kademeli dağıtım, SIEM ile entegrasyon ve işletime devir. Sensör yerleşimi ağ topolojinize göre belirlenir; ajan dağıtımında mevcut uç nokta koruma yazılımlarıyla uyum ve performans etkisi pilotta gözlenir.',
      fit: 'Bulut yönetimli konsollarda sunucu kurulumu yapılmaz; politika tasarımı ve ajan/sensör dağıtımı yapılır.',
    },
    {
      code: 'Bileşen B',
      title: 'İşletim',
      body: 'Politika ve istisna yönetimi, ajan ve sensör sağlığı, koruma kapsamının izlenmesi (ajansız veya raporlamayan cihazların tespiti), sürüm takibi ve aylık sağlık ve kapsam raporu. Konu ürünün müşteride doğru ve eksiksiz çalışmasıdır.',
      fit: 'İki paket vardır. Temel: konsolda salt-okunur rol, değişiklikler öneri olarak sunulur. Tam: müşteri onayıyla sınırlı yetkili rol, onaylı değişiklikler Deresys tarafından uygulanır.',
    },
    {
      code: 'Bileşen C',
      title: 'Tespit Ayarlama ve Entegrasyon',
      body: 'Yanlış pozitif analizi, onaylı istisna ve kural ayarı, MITRE ATT&CK kapsam değerlendirmesi, EDR/NDR alarmlarının SIEM ve otomasyon akışlarına bağlanması.',
    },
  ],
  outputs: [
    { name: 'Dağıtım planı, politika matrisi ve as-built doküman', body: 'Kurulum bileşeninde' },
    { name: 'Aylık Sağlık ve Kapsam Raporu', body: 'İşletim bileşeninde' },
    { name: 'Değişiklik kayıtları', body: 'İşletim bileşeninde, her politika ve istisna değişikliği için' },
    { name: 'Tespit ayarlama notu ve kapsam değerlendirmesi', body: 'Tespit Ayarlama bileşeninde' },
  ],
  fit: 'EDR veya NDR platformuna yatırım yapmış ama konsolu işletecek ayrılmış ekibi olmayan; ajanların güncel ve kapsamın eksiksiz kalmasını sürekli kılmak isteyen kurumlar için.',
  note: 'Tespit edilen bir olay için Olay Müdahalesi hizmetimize bakabilirsiniz.',
};

export const av = {
  image: '/cozumler/av-uc-nokta-koruma.webp',
  imageAlt: 'Altıgen hücreli turuncu bir kalkanın altında korunan dizüstü bilgisayar, monitör ve masaüstü; kalkana çarpan zararlı yazılım temsilleri',
  metaTitle: 'Uç Nokta Koruma (AV) Kurulum, Bakım ve İşletim',
  description: 'Kurumsal antivirüs ve uç nokta koruma platformları için kurulum, sürüm ve güncelleme bakımı, politika ve kapsam işletimi.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'Uç nokta koruma kurulum, bakım ve işletim',
  lead: 'Kurumsal antivirüs ve uç nokta koruma platformunuzun kurulumu, sürüm ve güncelleme zincirinin bakımı, politika ve koruma kapsamının işletimi. Kurulum bir proje; bakım ve işletim aylık hizmettir.',
  componentsTitle: 'Üç bileşen',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum',
      body: 'Yönetim konsolunu ve istemci dağıtımını işletime hazır teslim eden altı fazlı proje: keşif (cihaz envanteri, mevcut ürün ve sürümler, güncelleme yolu), tasarım (konsol mimarisi, grup yapısı, politika matrisi), konsol kurulumu, pilot, kademeli dağıtım, doğrulama ve devir. Üretici içi sürüm yükseltmeleri de aynı fazlarla ayrı proje olarak yapılır.',
      fit: 'On-prem konsollar tam kapsamdadır. Bulut yönetimli konsollarda sunucu kurulumu olmaz; politika tasarımı ve istemci dağıtımı yapılır.',
    },
    {
      code: 'Bileşen B',
      title: 'Bakım',
      body: 'Platformun sağlığını, sürümünü ve güncelleme zincirini ayakta tutan aylık hizmet: konsol, veritabanı ve sunucu sağlık kontrolü, tanım ve motor güncelleme doğrulaması, istemci bağlantı sağlığı, yama ve sürüm takibi, planlı pencerede yama uygulaması, yedek ve geri dönüş testi, lisans ve sertifika bitiş takvimi. Teknik destek dahildir.',
      fit: 'Üretici destek takvimleri değişir; her müşteride sürüm ve destek durumu tablosu yeniden doğrulanır ve destek sonuna yaklaşan sürümler önceden bildirilir.',
    },
    {
      code: 'Bileşen C',
      title: 'İşletim',
      body: 'Koruma politikasının ve kapsamının mesai saatlerinde yönetilmesi: korumasız, güncel olmayan veya ajanı devre dışı cihazların tespiti ve listelenmesi, konsolda biriken uyarıların gözden geçirilip özetlenmesi, değişiklik talebi akışı, çeyreklik politika gözden geçirmesi ve aylık rapor.',
      fit: 'İki paket vardır. Temel: salt-okunur erişim, politika ve istisna değişiklikleri öneri olarak sunulur. Tam: müşteri onayıyla sınırlı yetkili rol, onaylı değişiklikler Deresys tarafından uygulanır.',
    },
  ],
  outputs: [
    { name: 'Mevcut durum notu, sürüm ve destek durumu tablosu', body: 'Kurulum bileşeninde' },
    { name: 'Tasarım dokümanı, politika matrisi, as-built doküman ve teslim tutanağı', body: 'Kurulum bileşeninde' },
    { name: 'Kontrol listesi, bulgular ve değişiklik kayıtları', body: 'Bakım bileşeninde' },
    { name: 'Aylık Sağlık ve Kapsam Raporu', body: 'İşletim bileşeninde: güncel kalma oranı, korumasız cihazlar, tespit özeti, değişiklik kayıtları, sürüm ve destek durumu' },
  ],
  fit: 'Kurumsal bir uç nokta koruma ürünü kullanan ama konsolu işletecek ayrılmış ekibi olmayan kurumlar için. Üretici desteği sona ermiş veya ermek üzere olan sürümler kullanan kurumlarda yükseltme projesi ile başlanır.',
};

export const soar = {
  image: '/cozumler/soar-otomasyon.webp',
  imageAlt: 'Birbirine geçen dişlilerin ortasında kalkan simgesi; solda veri kaynakları, sağda otomatik aksiyonlar',
  metaTitle: 'SOAR ve Güvenlik Otomasyonu',
  description: 'Güvenlik orkestrasyon ve otomasyon (SOAR) platformları için kurulum, playbook geliştirme ve işletim.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'SOAR ve güvenlik otomasyonu',
  lead: 'Tekrarlayan güvenlik operasyon işlerinin playbook’lara dönüştürülmesi, SOAR platformunun kurulumu ve işletimi. Üç bileşen ayrı ayrı alınabilir.',
  componentsTitle: 'Üç bileşen',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum ve Entegrasyon',
      body: 'Platform mimarisi, kurulum ve temel yapılandırma; SIEM, EDR, ticket sistemi ve e-posta gibi kaynaklarla entegrasyonların kurulması; vaka (case) ve alan modeli tasarımı; kabul testi ve devir teslim.',
    },
    {
      code: 'Bileşen B',
      title: 'Playbook Geliştirme',
      body: 'Ekibinizin en çok zaman harcadığı işlerin (phishing e-postası analizi, IOC zenginleştirme, hesap kilitleme, ticket açma ve güncelleme gibi) belirlenmesi, akışlarının tasarlanması, playbook olarak geliştirilmesi, test edilmesi ve belgelenmesi. Onay adımları gerektiren aksiyonlar insan onayına bağlanır.',
    },
    {
      code: 'Bileşen C',
      title: 'İşletim',
      body: 'Platform sağlığı, entegrasyon bağlantılarının izlenmesi, playbook hata ve başarı oranlarının takibi, güncelleme, değişiklik kaydı ve aylık rapor. Kaynak sistemlerde değişiklik olduğunda playbook’ların uyarlanması.',
    },
  ],
  outputs: [
    { name: 'Mimari tasarım ve entegrasyon dokümanı', body: 'Kurulum bileşeninde' },
    { name: 'Playbook envanteri, akış diyagramları ve test kayıtları', body: 'Playbook Geliştirme bileşeninde' },
    { name: 'Aylık işletim raporu', body: 'İşletim bileşeninde: platform sağlığı, entegrasyon durumu, playbook çalışma özeti' },
  ],
  fit: 'Güvenlik operasyonunda tekrarlayan işleri otomatikleştirmek isteyen, SOAR platformuna yatırım yapmış veya yapmaya hazırlanan kurumlar için.',
};

export const tehdit = {
  figure: { src: '/cozumler/adli-veri-toplama.webp', alt: 'Parmak izi, dosya ve disk simgeleriyle adli veri toplama akışı; bir dizüstü bilgisayara akan dosya parçaları' },
  image: '/cozumler/tehdit-avciligi.webp',
  imageAlt: 'Ağ düğümlerinin üzerinde, uyarı bayraklarını gösteren büyüteç',
  metaTitle: 'Tehdit Avcılığı ve Compromise Assessment',
  description: 'Ortamda aktif ya da geçmiş bir ihlalin izini arayan tehdit avcılığı ve compromise assessment çalışmaları; adli veri toplama platformu kurulumu ve işletimi.',
  eyebrow: 'DANIŞMANLIK HİZMETLERİ',
  title: 'Tehdit avcılığı ve compromise assessment',
  lead: 'Ortamınızda, mevcut kontrollerin yakalamadığı aktif ya da geçmiş bir ihlalin izini arayan çalışmalar. Compromise assessment bir kez yapılan kapsamlı bir değerlendirmedir; tehdit avcılığı hipotez bazlı ve tekrarlanabilir bir çalışmadır.',
  componentsTitle: 'Çalışma modelleri',
  components: [
    {
      code: 'Model A',
      title: 'Compromise Assessment',
      body: 'Belirlenen sistem kümesinde adli veri toplama, kalıcılık (persistence), yanal hareket ve veri sızdırma izlerinin aranması, bilinen tehdit göstergeleri ve davranışsal örüntülerle eşleştirme, bulguların doğrulanması ve raporlanması. Sonuç, ortamda ihlal belirtisi bulunup bulunmadığına dair kanıta dayalı bir değerlendirmedir.',
      fit: 'Şu durumda uygun: bir birleşme/devralma öncesi, uzun süredir değişmeyen bir ortamda ya da bir sektör olayı sonrası “içeride bir şey var mı” sorusunun yanıtlanması gerekiyor.',
    },
    {
      code: 'Model B',
      title: 'Tehdit Avcılığı',
      body: 'MITRE ATT&CK tekniklerine ve güncel tehdit istihbaratına dayalı hipotezlerle log ve uç nokta verisi üzerinde sistematik arama. Her çalışma sonunda yeni tespit kuralı önerileri ve kapsam boşluğu bulguları üretilir.',
      fit: 'Şu durumda uygun: SIEM ve EDR kurulu ama tespit kapsamının dışında kalan teknikleri proaktif aramak istiyorsunuz.',
    },
    {
      code: 'Model C',
      title: 'Adli Veri Toplama Platformu',
      body: 'Hızlı ve yaygın uzaktan adli veri toplamayı sağlayan platformun kurulumu, bakımı ve işletimi. Kurulum; mimari, ajan dağıtımı ve toplama profilleri tasarımını içerir. İşletim; platform sağlığı, profil güncellemeleri ve toplama görevlerinin yönetimini içerir.',
      fit: 'Olay müdahale ve compromise assessment çalışmalarında kendi ekibinizin de kullanabileceği bir toplama altyapısı isteyen kurumlar için.',
    },
  ],
  outputs: [
    { name: 'Kapsam ve veri toplama planı', body: 'Çalışma başlangıcında, kapsamdaki sistemler ve toplanacak veri türleriyle birlikte' },
    { name: 'Bulgu raporu', body: 'Kanıtlarıyla birlikte, her bulgunun doğrulama durumu ve önem derecesi belirtilir' },
    { name: 'Tespit iyileştirme önerileri', body: 'Yeni kural önerileri ve kapsam boşluğu listesi' },
    { name: 'Yönetici özeti', body: 'Karar vericiler için sonuç ve önerilen aksiyonlar' },
  ],
  fit: 'Mevcut kontrollerin yakalamadığı bir ihlal olasılığını doğrulamak isteyen, ya da tespit kapsamını proaktif aramalarla sınamak isteyen kurumlar için.',
  note: 'Çalışma kapsamında toplanan veriler kişisel veri içerebilir. Veri toplama kapsamı, saklama süresi ve imhası, çalışma başlamadan sözleşmede ve KVKK çerçevesinde tanımlanır.',
};
