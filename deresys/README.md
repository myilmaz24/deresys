# deresys.com.tr

Astro + Cloudflare Pages. Kaynaklar: `CONTEXT.md` (doğrulanmış gerçekler),
`COPY.md` (sayfa metinleri), `DESIGN.md` (tasarım sistemi).

## Çalıştırma

    npm install
    npm run dev      # http://localhost:4321
    npm run build    # dist/ üretir
    npm run preview

## Yapı

    src/layouts/Base.astro       sayfa iskeleti, font yüklemeleri
    src/components/              Nav, Footer, PageHead, Cta, Draft
    src/pages/                   13 sayfa
    src/styles/global.css        DESIGN.md token'ları
    src/assets/                  logo SVG'leri (PDF'den dönüştürülmüş)
    public/favicon.svg

## Kurallar

- Sayfa metinleri COPY.md'den birebir alınmıştır. Metin burada değil,
  COPY.md'de düzenlenir.
- `COPY.md`'de `[DOLDURULACAK]` olan bölümler sitede kesikli çerçeveli
  "taslak" bloğu olarak görünür. İçerik uydurulmamıştır.
- Referans, müşteri logosu, basın bahsi veya istatistik yoktur.
- Üçüncü taraf gömme yoktur. Fontlar self-host (D-08).

## Fontlar

`@fontsource` paketlerinden self-host edilir. latin-ext alt kümesi
Türkçe glifler (ş ğ İ ı ö ü ç) için zorunludur, kaldırılmamalıdır.
