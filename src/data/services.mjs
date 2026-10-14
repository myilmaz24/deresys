// Hizmet sayfası içerikleri. Marka adı, fiyat, SLA/yanıt süresi, kapasite ve referans içermez.
// Markalar yalnızca SupportedTechnologies bileşeninde yer alır.
// Her hizmet kısa tutulur: ne var, ne yapılır. Ayrıntı görüşmede verilir.
//
// image: sayfa üstü banner (1600x900). thumb: hizmet listesindeki küçük görsel (480x270).

export const siem = {
  image: '/cozumler/siem.webp',
  thumb: '/cozumler/thumb/siem.webp',
  imageAlt: 'Log akışlarının merkezi bir veri deposunda toplandığı, büyük ekranlı turuncu tonlarda bir güvenlik operasyon odası',
  metaTitle: 'SIEM Kurulum, İşletim ve Kural Geliştirme',
  description: 'Kurumsal SIEM platformları için on-prem kurulum, sürekli işletim ve MITRE ATT&CK bazlı kural danışmanlığı.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'SIEM kurulum, işletim ve kural geliştirme',
  lead: 'Kurumsal SIEM platformunuzun kurulumu, işletimi ve tespit kurallarının geliştirilmesi. Üç bileşen ayrı ayrı alınabilir.',
  componentsTitle: 'Hizmet kapsamı',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum',
      body: 'On-prem SIEM ortamının tasarlanması, kurulması ve ilk log kaynaklarıyla devreye alınması. Mimari, sizing, veri modeli, parsing, kabul testi ve devir teslim. Kapsam on-prem dağıtımdır.',
    },
    {
      code: 'Bileşen B',
      title: 'İşletim',
      body: 'Platformun sağlıklı ve güncel kalması: sağlık kontrolü, güncellemeler, kapasite ve lisans takibi, log kaynağı kesintilerinin izlenmesi, aylık rapor.',
    },
    {
      code: 'Bileşen C',
      title: 'Kural Danışmanlığı',
      body: 'Mevcut kural ve alarmların MITRE ATT&CK kapsamına göre değerlendirilmesi ve önceliklendirilmiş iyileştirme raporu. İsteğe bağlı olarak kuralların Deresys tarafından uygulanması.',
    },
  ],
};

export const edrNdr = {
  image: '/cozumler/edr-ndr.webp',
  thumb: '/cozumler/thumb/edr-ndr.webp',
  imageAlt: 'Dünya haritası üzerinde birbirine bağlı uç noktalar, sunucular ve uyarı işaretleri; radar ve izleme panelleri',
  metaTitle: 'EDR / NDR Kurulum ve İşletim',
  description: 'Uç nokta (EDR) ve ağ (NDR) tespit platformları için devreye alma, politika yönetimi, kapsam takibi ve tespit ayarlama.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'EDR / NDR kurulum ve işletim',
  lead: 'Uç nokta ve ağ tespit platformlarınızın devreye alınması, yönetimi ve tespit kalitesinin ayarlanması. Üç bileşen ayrı ayrı alınabilir.',
  componentsTitle: 'Hizmet kapsamı',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum',
      body: 'EDR ajanı ve NDR sensörünün dağıtım planı, pilot grup, politika tasarımı, kademeli dağıtım ve SIEM entegrasyonu.',
    },
    {
      code: 'Bileşen B',
      title: 'İşletim',
      body: 'Politika ve istisna yönetimi, ajan ve sensör sağlığı, koruma kapsamının izlenmesi, sürüm takibi ve aylık rapor.',
    },
    {
      code: 'Bileşen C',
      title: 'Tespit Ayarlama ve Entegrasyon',
      body: 'Yanlış pozitif analizi, kural ve istisna ayarı, MITRE ATT&CK kapsam değerlendirmesi, alarmların SIEM ve otomasyon akışlarına bağlanması.',
    },
  ],
  note: 'Tespit edilen bir olay için Olay Müdahalesi hizmetimize bakabilirsiniz.',
};

export const av = {
  image: '/cozumler/av-uc-nokta-koruma.webp',
  thumb: '/cozumler/thumb/av-uc-nokta-koruma.webp',
  imageAlt: 'Altıgen hücreli turuncu bir kalkanın altında korunan dizüstü bilgisayar, monitör ve masaüstü; kalkana çarpan zararlı yazılım temsilleri',
  metaTitle: 'Uç Nokta Koruma (AV) Kurulum, Bakım ve İşletim',
  description: 'Kurumsal antivirüs ve uç nokta koruma platformları için kurulum, sürüm ve güncelleme bakımı, politika ve kapsam işletimi.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'Uç nokta koruma kurulum, bakım ve işletim',
  lead: 'Kurumsal antivirüs ve uç nokta koruma platformunuzun kurulumu, bakımı ve işletimi. Kurulum bir proje; bakım ve işletim aylık hizmettir.',
  componentsTitle: 'Hizmet kapsamı',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum',
      body: 'Keşif, tasarım, konsol kurulumu, pilot ve kademeli istemci dağıtımı. Üretici içi sürüm yükseltmeleri de aynı akışla ayrı proje olarak yapılır.',
    },
    {
      code: 'Bileşen B',
      title: 'Bakım',
      body: 'Konsol ve sunucu sağlık kontrolü, güncelleme doğrulaması, yama ve sürüm takibi, yedek ve geri dönüş testi, lisans ve sertifika bitiş takvimi.',
    },
    {
      code: 'Bileşen C',
      title: 'İşletim',
      body: 'Politika ve kapsam yönetimi, korumasız veya güncel olmayan cihazların tespiti, konsol uyarılarının gözden geçirilmesi, aylık rapor.',
    },
  ],
};

export const soar = {
  image: '/cozumler/soar-otomasyon.webp',
  thumb: '/cozumler/thumb/soar-otomasyon.webp',
  imageAlt: 'Birbirine geçen dişlilerin ortasında kalkan simgesi; solda veri kaynakları, sağda otomatik aksiyonlar',
  metaTitle: 'SOAR ve Güvenlik Otomasyonu',
  description: 'Güvenlik orkestrasyon ve otomasyon (SOAR) platformları için kurulum, playbook geliştirme ve işletim.',
  eyebrow: 'OPERASYONEL HİZMETLER',
  title: 'SOAR ve güvenlik otomasyonu',
  lead: 'Tekrarlayan güvenlik operasyon işlerinin playbook’lara dönüştürülmesi, SOAR platformunun kurulumu ve işletimi. Üç bileşen ayrı ayrı alınabilir.',
  componentsTitle: 'Hizmet kapsamı',
  components: [
    {
      code: 'Bileşen A',
      title: 'Kurulum ve Entegrasyon',
      body: 'Platform kurulumu ve SIEM, EDR, ticket sistemi, e-posta gibi kaynaklarla entegrasyonlar. Kabul testi ve devir teslim.',
    },
    {
      code: 'Bileşen B',
      title: 'Playbook Geliştirme',
      body: 'En çok zaman alan işlerin (phishing analizi, IOC zenginleştirme, hesap kilitleme, ticket yönetimi gibi) playbook olarak tasarlanması, geliştirilmesi ve test edilmesi. Kritik aksiyonlar insan onayına bağlanır.',
    },
    {
      code: 'Bileşen C',
      title: 'İşletim',
      body: 'Platform ve entegrasyon sağlığı, playbook başarı ve hata takibi, güncellemeler, kaynak sistem değişikliklerine uyarlama ve aylık rapor.',
    },
  ],
};

export const tehdit = {
  figure: { src: '/cozumler/adli-veri-toplama.webp', alt: 'Parmak izi, dosya ve disk simgeleriyle adli veri toplama akışı; bir dizüstü bilgisayara akan dosya parçaları' },
  image: '/cozumler/tehdit-avciligi.webp',
  thumb: '/cozumler/thumb/tehdit-avciligi.webp',
  imageAlt: 'Ağ düğümlerinin üzerinde, uyarı bayraklarını gösteren büyüteç',
  metaTitle: 'Tehdit Avcılığı ve Compromise Assessment',
  description: 'Ortamda aktif ya da geçmiş bir ihlalin izini arayan tehdit avcılığı ve compromise assessment çalışmaları; adli veri toplama platformu kurulumu ve işletimi.',
  eyebrow: 'DANIŞMANLIK HİZMETLERİ',
  title: 'Tehdit avcılığı ve compromise assessment',
  lead: 'Mevcut kontrollerin yakalamadığı aktif ya da geçmiş bir ihlalin izini arayan çalışmalar.',
  componentsTitle: 'Hizmet kapsamı',
  components: [
    {
      code: 'Model A',
      title: 'Compromise Assessment',
      body: 'Belirlenen sistemlerde adli veri toplama ve kalıcılık, yanal hareket, veri sızdırma izlerinin aranması. Sonuç, ortamda ihlal belirtisi olup olmadığına dair kanıta dayalı bir rapordur.',
    },
    {
      code: 'Model B',
      title: 'Tehdit Avcılığı',
      body: 'MITRE ATT&CK ve güncel tehdit istihbaratına dayalı hipotezlerle log ve uç nokta verisinde sistematik arama. Her çalışmadan yeni kural önerileri çıkar.',
    },
    {
      code: 'Model C',
      title: 'Adli Veri Toplama Platformu',
      body: 'Uzaktan adli veri toplama platformunun kurulumu, bakımı ve işletimi. Ekibiniz olay anında kendi toplamasını yapabilir.',
    },
  ],
  note: 'Çalışma kapsamında toplanan veriler kişisel veri içerebilir. Kapsam, saklama süresi ve imha, çalışma başlamadan sözleşmede ve KVKK çerçevesinde tanımlanır.',
};

// Ayrı veri yapısı kullanan danışmanlık sayfalarının banner ve thumbnail bilgisi.
export const banners = {
  olayMudahalesi: {
    image: '/cozumler/olay-mudahalesi.webp',
    thumb: '/cozumler/thumb/olay-mudahalesi.webp',
    imageAlt: 'Bilgisayar başındaki güvenlik analisti; uyarı simgeli zararlı yazılımlar altıgen hücreli kalkana çarpıyor, yanında yanan alarm lambası',
  },
  vciso: {
    image: '/cozumler/vciso.webp',
    thumb: '/cozumler/thumb/vciso.webp',
    imageAlt: 'Şehre bakan bir yönetici ofisinde, radar, kalkan ve uyarı haritası panelleri önünde duran yönetici silüeti; masada satranç taşları',
  },
  olgunluk: {
    image: '/cozumler/olgunluk-programi.webp',
    thumb: '/cozumler/thumb/olgunluk-programi.webp',
    imageAlt: 'Basamaklar boyunca yükselen ok ve düğüm ağı; en üstte parlayan bir kalkan',
  },
  socDanismanligi: {
    image: '/cozumler/soc-danismanligi.webp',
    thumb: '/cozumler/thumb/soc-danismanligi.webp',
    imageAlt: 'Geniş ekranlı bir güvenlik operasyon merkezinde ekranı gösteren iki kişi; üstte kalkan merkezli insan, süreç ve veri simgeleri',
  },
};

// Üç ana başlığın (danışmanlık, operasyonel, akademi) banner ve thumbnail bilgisi.
// Anasayfa kartlarında thumbnail, /cozumler sayfasında başlık bloğunda banner olarak kullanılır.
export const groupBanners = {
  danismanlik: {
    image: '/cozumler/grup-danismanlik.webp',
    thumb: '/cozumler/thumb/grup-danismanlik.webp',
    imageAlt: 'El sıkışan iki iş insanı; arkada hedefe uzanan yol, grafikler, dünya küresi ve büyüteç',
  },
  operasyonel: {
    image: '/cozumler/grup-operasyonel.webp',
    thumb: '/cozumler/thumb/grup-operasyonel.webp',
    imageAlt: 'Birbirine geçen dişliler, akış şeması, gösterge paneli ve konveyör üzerinde çalışan robot kol',
  },
  akademi: {
    image: '/cozumler/grup-akademi.webp',
    thumb: '/cozumler/thumb/grup-akademi.webp',
    imageAlt: 'Kilit simgeli kalkan, mezuniyet kepi ve takvim; çevresinde parlayan düğüm ağı',
  },
};
