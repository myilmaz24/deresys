---
title: "Yapay Zeka Çağında Siber Güvenliğin Yeni Cephesi: Modellerin, Süreçlerin ve Otonom Ajanların Korunması"
description: "Yapay zeka modellerini hedef alan yeni nesil tehditler, dört sütunlu uçtan uca yapay zeka güvenliği mimarisi, müdahalesiz güvenlik yaklaşımı, otonom ajan riskleri ve Türkiye ekosistemi için stratejik öneriler."
pubDate: 2026-10-20
author: "DERESYS"
tags: ["Yapay Zeka Güvenliği"]
image: "/blog/ai-guvenligi-yapay-zeka-modelleri-ajanlar/cover.png"
imageAlt: "Turuncu bir kalkanın içinde AI yazan, Deresys Siber Güvenlik imzalı Yapay Zeka Güvenliği görseli"
---

Geleneksel siber güvenlik katmanları; ağları, uç noktaları, on-prem ve bulut ortamlarını başarıyla korusa da, doğrudan yapay zeka modellerinin matematiksel yapısını ve veri işleme mantığını hedef alan yeni nesil tehditlere karşı yetersiz kalmaktadır. Yapay zeka sistemlerinin iş dünyasının temel dinamiği haline gelmesi, güvenlik ekiplerinin yalnızca altyapıyı değil, modelin kendisini de korunması gereken yeni bir saldırı yüzeyi olarak ele almasını zorunlu kılmaktadır.

Bu yazıda modern yapay zeka güvenlik mimarilerinin nasıl kurgulanması gerektiğini, uçtan uca bir yaşam döngüsü yaklaşımıyla ve Türkiye ekosistemine özgü stratejik çıkarımlarla inceliyoruz.

## Özet

- Klasik güvenlik araçları (WAF, EDR, SIEM) modellerin içindeki anlamsal ve matematiksel saldırı vektörlerini göremez.
- Yapay zeka güvenliği dört sütunda kurgulanmalıdır: varlık keşfi, tedarik zinciri güvenliği, saldırı simülasyonu ve çalışma sırasında koruma.
- Müdahalesiz (non-invasive) mimari, model ağırlıklarına ve ham veriye erişim istemeden koruma sağladığı için regüle sektörlerde ve hava boşluklu ortamlarda kritik bir standarttır.
- Otonom ajanlar ve MCP mimarileri, prompt injection'ı doğrudan kurumsal altyapıya sıçrayan bir ayrıcalık yükseltme riskine dönüştürür.
- 7545 sayılı Siber Güvenlik Kanunu, yapay zeka modellerini de envanter, risk analizi ve dayanıklılık yükümlülüklerinin içine çeken yeni bir zemin oluşturmaktadır.

## Geleneksel siber güvenlik neden yapay zeka tehditlerine karşı yetersiz kalıyor?

Geleneksel savunma sistemleri ikili dosya anomalilerini ve bilinen ağ imzalarını hedeflerken, yapay zeka sistemleri doğrudan anlamsal manipülasyonlar ve tensör seviyesindeki saptırmalarla istismar edilmektedir. ([Tensör](https://tr.wikipedia.org/wiki/Tens%C3%B6r): çok boyutlu verileri, yönleri ve bunlar arasındaki doğrusal ilişkileri temsil eden geometrik ve cebirsel bir nesnedir.)

Klasik güvenlik araçları (WAF, EDR veya SIEM), girdi olarak verilen bir cümlenin veri tabanına SQL enjeksiyonu yapıp yapmadığını analiz etmekte oldukça başarılıdır. Ancak aynı girdi, büyük dil modeline (LLM) sistem talimatlarını unutturmayı amaçlayan karmaşık bir **prompt injection** veya **jailbreak** saldırısı içerdiğinde klasik filtreler etkisiz kalmaktadır. Model ağırlıkları, tensör operasyonları ve çıkarım (inference) süreçleri, geleneksel kurallarla denetlenemeyen tamamen farklı bir matematiksel mantık barındırır.

Yapay zeka modellerine yönelik riskler sadece girdi manipülasyonuyla sınırlı değildir. Saldırganlar, eğitim verilerini manipüle ederek arka kapılar yerleştirebilmekte (**data poisoning**), özel modellerin ağırlıklarını sorgular üzerinden tersine mühendislikle çalabilmekte (**model extraction / inversion**) veya modellere gizlenmiş zararlı kodları tetikleyebilmektedir.

- Geleneksel siber güvenlik katmanları, model içi mantıksal zafiyetleri ve anlamsal saldırı vektörlerini tespit edemez.
- Model geliştirme ve dağıtım süreçleri, klasik yazılım geliştirme süreçlerine göre çok daha fazla üçüncü taraf veri ve açık kaynaklı ağırlık bağımlılığı taşır.
- Yapay zeka sistemlerinin güvenliği, yalnızca altyapıyı değil, modelin bilişsel ve algoritmik bütünlüğünü doğrudan korumayı gerektirir.

## Uçtan uca yapay zeka güvenliği: dört temel sütun nasıl kurgulanır?

![Uçtan uca yapay zeka güvenlik mimarisi: varlık keşfi, tedarik zinciri, saldırı testi ve çalışma zamanı olmak üzere dört sütun](/blog/ai-guvenligi-yapay-zeka-modelleri-ajanlar/dort-sutun-mimari.png)

Modern yapay zeka güvenliği, parçalı yöntemler yerine varlık keşfi, tedarik zinciri analizi, saldırı simülasyonu ve çalışma sırasında korumayı tek bir çatı altında birleştiren bütüncül bir mimariyi gerektirir.

Güvenlik, modeller henüz geliştirme aşamasındayken başlamalı ve canlı operasyona kadar kesintisiz devam etmelidir. Yaklaşım; geleneksel tahmine dayalı (predictive) makine öğreniminden modern üretken yapay zekaya ve otonom ajanlara (agentic AI) kadar tüm model türlerini kapsar.

### 1. Varlık keşfi ve envanter yönetimi

Kurumların en büyük açıklarından biri, güvenlik ekiplerinin bilgisi dışında geliştirilen veya üçüncü taraf servislerle entegre edilen "Gölge Yapay Zeka" (shadow AI) uygulamalarıdır.

- Bulut sağlayıcıları, şirket içi sunucular ve geliştirici ortamlarındaki tüm yapay zeka varlıklarını otomatik olarak keşfederek envanter çıkarır.
- Üretim ve geliştirme aşamasındaki modellerin, veri setlerinin ve uygulama bağımlılıklarının hiyerarşik ilişki haritasını sunar.
- Güvenlik ekiplerine görünmeyen modellerin kontrolsüz şekilde hassas kurumsal verilerle beslenmesini engeller.

### 2. Tedarik zinciri güvenliği ve model tarama

Yazılım dünyasında SBOM (Software Bill of Materials) ne anlama geliyorsa, yapay zekada da AIBOM (AI Bill of Materials) aynı kritik öneme sahiptir. Açık kaynak platformlardan indirilen modeller doğrudan zararlı kod barındırabilir.

- Model dosyalarını derinlemesine tarayarak zararlı yazılımları, arka kapıları ve gömülü istismarları tespit eder.
- Model bileşenlerinin soyağacını, sürüm bütünlüğünü ve bilinen zafiyetlerini (CVE) kataloglar.
- Güvenli olmayan veya kaynağı doğrulanmamış açık kaynaklı modellerin kurumsal ortama girişini otomatik olarak engeller.

### 3. Saldırı simülasyonu ve otomatize red teaming

Statik testler dinamik yapay zeka saldırılarını öngörmek için yetersiz kaldığından, modellerin sürekli olarak düşmanca (adversarial) senaryolarla test edilmesi zorunludur.

- Otomatize red teaming mekanizmaları, modelleri gerçek saldırgan teknikleriyle sürekli zorlar.
- Sistem promptlarının sağlamlığını test ederek olası sızıntı ve manipülasyon risklerini raporlar.
- Geliştirme aşamasında tespit edilen zafiyetlerin üretime geçmeden önce giderilmesini sağlayarak maliyetli güvenlik açıklarını minimize eder.

### 4. Çalışma sırasında koruma ve tespit/yanıt

Canlıya alınan modellerin gelen girdileri ve ürettiği çıktıları gerçek zamanlı olarak izleyen bir yapay zeka güvenlik duvarı görevi görür.

- **Girdi denetimi:** Modele iletilen prompt enjeksiyonlarını, zararlı niyetleri ve kaçınma (evasion) taktiklerini milisaniyeler seviyesinde yakalar.
- **Çıktı filtreleme:** Model çıktılarında hassas kurumsal verilerin (PII, fikri mülkiyet, şifreler) sızmasını ve halüsinasyon sonucu üretilen tehlikeli yanıtları engeller.
- **Yapay zeka tespit ve yanıt (AIDR):** Otonom araç kullanan ajanların Model Context Protocol (MCP) üzerinden yetkisiz sistem fonksiyonlarını çağırmasını sınırlandırır.

## Müdahalesiz (non-invasive) güvenlik mimarisi neden kritik bir standarttır?

Bir güvenlik mimarisinin en önemli teknik farklılaştırıcılarından biri, modelin tescilli ağırlıklarına, kaynak koduna veya ham müşteri verilerine doğrudan erişim talep etmeden koruma sağlayabilmesidir.

Pek çok geleneksel denetim çözümü, modellerin kaynak kodlarının veya eğitim verilerinin üçüncü taraf platformlara aktarılmasını gerektirir. Bu durum, özellikle bankacılık, sağlık ve savunma sanayii gibi regüle edilen sektörlerde veri egemenliği ve KVKK/GDPR uyumluluğu açısından ciddi hukuki engeller yaratır.

Bu yaklaşım, modellerin tensör yapısını, girdi-çıktı davranış kalıplarını ve model artefaktlarını harici bir katmanda gözlemleyerek çalışır. Böylece fikri mülkiyet riske atılmadan veya hassas veriler üçüncü taraflarla paylaşılmadan yapay zeka modelleri koruma altına alınmış olur.

- Model parametrelerine ve gizli eğitim verilerine erişim gerektirmez; veri mahremiyetini tamamen korur.
- Hava boşluklu (air-gapped) ortamlarda çalışabilme yeteneği sayesinde kritik kamu ve savunma altyapılarına tam uyum sağlar.
- Model işleme süresine fark edilir bir gecikme eklemeden (genellikle 50 milisaniyenin altında) gerçek zamanlı koruma sunar.

![Yapay zeka güvenlik yaşam döngüsü: geliştirme, tedarik zinciri, kabul testi ve çalışma zamanı evrelerini destekleyen kalıcı güvenlik katmanı](/blog/ai-guvenligi-yapay-zeka-modelleri-ajanlar/yasam-dongusu.png)

## Otonom ajanlar (agentic AI) ve MCP mimarilerinde güvenlik riskleri nasıl değişiyor?

Yapay zekanın yalnızca metin üreten sistemlerden dosya okuyan, API çağıran ve veri tabanı sorgulayan otonom ajanlara dönüşmesi, saldırıların doğrudan kurumsal altyapıya sıçramasına yol açmaktadır.

Sektör verilerine göre, gerçekleşen yapay zeka güvenlik ihlallerinin yaklaşık sekizde biri doğrudan otonom ajan sistemleriyle bağlantılıdır. Bir modele dış dünyayla etkileşim kurabileceği araçlar (MCP veya özel API eklentileri) verildiğinde, başarılı bir **indirect prompt injection** tüm sisteme yönelik bir ayrıcalık yükseltme saldırısına dönüşebilir.

Saldırganlar, modelin analiz etmesi için yüklenen bir PDF dosyasına veya harici bir web sayfasına görünmez talimatlar gizleyebilmektedir. Model bu veriyi okuduğunda, saldırganın talimatını uygulayarak kullanıcının yetkisi dahilindeki e-postaları dışarı sızdırabilir veya kritik kurumsal veri tabanlarında yetkisiz sorgular çalıştırabilir.

- Ajanların araç çağırma (tool calling) davranışları çalışma sırasında sıkı sınırlarla denetlenmeli ve yetki aşımı engellenmelidir.
- Dış kaynaklardan gelen tüm veriler, model tarafından işlenmeden önce anlamsal güvenlik duvarından geçirilmelidir.
- Otonom sistemlerin kritik operasyonları (veri silme, finansal transfer, yetkilendirme) yürütmeden önce insan onay mekanizmalarına (human-in-the-loop) bağlanması sağlanmalıdır.

## Türkiye siber güvenlik ekosistemi için stratejik yol haritası ve öneriler

Türkiye'deki kamu kurumları, finans kuruluşları ve teknoloji girişimleri yapay zekayı hızla benimserken, güvenlik süreçlerini yalnızca klasik altyapı denetimleriyle sınırlı tutma yanılgısından hızla uzaklaşmalıdır. Bu dönüşümün hukuki zemini de artık net şekilde belirlenmiştir.

Türkiye, siber güvenliği ulusal güvenliğin ayrılmaz bir parçası olarak tanımlayan 7545 sayılı Siber Güvenlik Kanunu ile siber savunmayı "risk" değil "yükümlülük" kavramı üzerinden yeniden kurmuştur. 19 Mart 2025'te Resmî Gazete'de yayımlanan kanun; bilişim sistemleri üzerinden hizmet sunan tüm kurum ve kuruluşları kapsamakta, Siber Güvenlik Başkanlığı ve Siber Güvenlik Kurulu yapılanmalarıyla denetim, sertifikasyon ve yaptırım süreçlerini tek çatı altında toplamaktadır. Kritik altyapıların ve kamu kurumlarının tüm varlıklarının envanterinin tutulması, risk analizlerinin yapılması ve siber dayanıklılığın artırılması artık yasal bir zorunluluktur.

Bu düzenlemenin yapay zeka güvenliği açısından anlamı büyüktür. Yapay zeka modelleri, kurumların envanterine dahil edilmesi gereken yeni nesil varlıklardır; bu modellerin tedarik zinciri, saldırı yüzeyi ve çalışma sırasındaki davranışı, mevcut yasa ve regülasyonların güncellenmesini gerektirmektedir.

### Yerli AIBOM ve model tarama altyapılarının geliştirilmesi

> **AIBOM** (Yapay Zekâ Malzeme Listesi / AI Bill of Materials), bir yapay zekâ veya makine öğrenimi sistemini oluşturmak için kullanılan tüm bileşenlerin, veri setlerinin, modellerin, yazılım kütüphanelerinin ve altyapı bağımlılıklarının detaylı ve makine tarafından okunabilir bir envanteridir. ([Sysdig](https://www.sysdig.com/learn-cloud-native/what-is-ai-bill-of-materials-aibom))

Açık kaynak ekosisteminden kontrolsüz model kullanımının önüne geçilmelidir. Kurumlar bünyesinde kullanılacak üçüncü taraf ağırlıkların serileştirme zafiyetlerine karşı taranması ve model bileşenlerinin kayıt altına alınması standart bir tedarik kuralı haline getirilmelidir.

### Finans ve kamu sektöründe çalışma sırasında koruma entegrasyonu

BDDK ve KVKK düzenlemelerine tabi kurumlar, canlıya aldıkları müşteri odaklı LLM asistanlarına doğrudan yapay zeka odaklı girdi/çıktı filtreleme katmanları eklemelidir. Bu filtreler, hassas müşteri verilerinin modele sızmasını ve dolaylı manipülasyonları gerçek zamanlı durdurabilmelidir.

### Hava boşluklu (air-gapped) savunma çözümleri

Türkiye'nin savunma sanayii ve kritik altyapı projelerinde kullanılan yapay zeka modelleri, dış bulut bağlantısına ihtiyaç duymayan tamamen izole ortamlarda korunmalıdır. Müdahalesiz güvenlik mimarileri, yerli savunma projelerinin güvenliğini dışa bağımlı olmadan sağlamak için en uygun modeldir.

- Kurumlar bünyesinde bir "Yapay Zeka Varlık Envanteri" çıkarılarak kontrolsüz shadow AI sistemleri tespit edilmelidir.
- Red teaming süreçleri, yapay zekaya özgü düşmanca saldırı simülasyonlarını kapsayacak şekilde güncellenmelidir.
- Yerli siber güvenlik üreticileri, portföylerine yapay zeka çalışma sırasında koruma ve güvenlik duvarı çözümlerini entegre etmelidir.

## Sonuç ve değerlendirme

Yapay zeka modelleri ve otonom sistemler iş dünyasının temel motoru haline gelirken, bu sistemlerin güvenliği bir yan özellik değil, temel bir iş sürekliliği şartıdır. Modern yapay zeka güvenlik mimarileri; varlık keşfinden başlayarak tedarik zincirini denetleyen, sistemleri saldırgan gözüyle test eden ve operasyon esnasında modeli müdahalesiz koruyan bütüncül bir yaklaşımın gerekliliğini ortaya koymaktadır. Türkiye siber güvenlik ekosistemi, bu prensipleri yerel regülasyonlar ve yerli mühendislik kabiliyetleriyle harmanlayarak güvenli yapay zeka dönüşümünde öncü bir rol üstlenebilir.

## Kaynaklar

- [Vikipedi — Tensör](https://tr.wikipedia.org/wiki/Tens%C3%B6r)
- [Sysdig — What is an AI Bill of Materials (AIBOM)?](https://www.sysdig.com/learn-cloud-native/what-is-ai-bill-of-materials-aibom)
