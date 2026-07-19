# Lumia — Güzellik Merkezi Platformu

Randevu + vitrin + yönetim paneli (CRM) platformu. Detaylı ürün spesifikasyonu için proje sahibiyle paylaşılan master prompt'a bakın.

## Teknoloji Stack

- **Next.js 14** (App Router) + TypeScript (strict) — `output: "standalone"` ile Hostinger Node.js runtime'ında çalışacak şekilde yapılandırıldı
- **Tailwind CSS** + shadcn/ui bileşenleri (manuel entegre edildi, bkz. `components/ui`) + lucide-react + Framer Motion (ileride eklenecek mikro-animasyonlar)
- **i18n:** next-intl — TR (varsayılan) / EN / AR (RTL) / RU, `messages/*.json`
- **Backend (Faz 2'de bağlanacak):** Nhost — Postgres + Hasura GraphQL + Auth + Storage
- **Form & doğrulama:** react-hook-form + zod
- **Tarih/saat:** date-fns + date-fns-tz (Faz 3 — availability engine)
- **Grafikler (Faz 4 — admin dashboard):** Recharts

## Proje Yapısı

```
/app/[locale]
  /(root)            page.tsx (Home), hizmetler, hizmet/[slug], portfolyo, hakkimizda, iletisim, randevu
/components
  /ui                shadcn tabanlı bileşenler
  /public            header, footer, hero, service-card, section'lar...
/lib
  /data              seed veriler (services, portfolio, testimonials, staff, media)
  config.ts          işletme bilgileri (telefon, WhatsApp, adres, harita)
  fonts.ts           Poppins (latin) + Noto Kufi/Sans Arabic (AR)
  format.ts          fiyat formatlama (Intl.NumberFormat)
/messages            tr.json, en.json, ar.json, ru.json
/i18n                next-intl routing/navigation/request config
/types               paylaşılan TypeScript tipleri
```

## Geliştirme

```bash
npm install
npm run dev
```

`http://localhost:3000` (dolu ise otomatik olarak sıradaki boş porta geçer, örn. 3001).

## Durum — Faz İlerlemesi

- [x] **Faz 0:** Proje kurulumu, Tailwind/shadcn/i18n, tasarım token'ları, layout iskeleti
- [x] **Faz 1:** Public vitrin (Home, Hizmetler, Hizmet Detay, Portfolyo, Hakkımızda, İletişim) — 4 dil + RTL, seed veriyle
- [ ] **Faz 2:** Nhost projesi + Hasura migration/metadata (permissions) + seed + Auth
- [ ] **Faz 3:** Availability engine + Randevu sihirbazı (uçtan uca)
- [ ] **Faz 4:** Admin/CRM paneli
- [ ] **Faz 5:** AI chat botu + WhatsApp entegrasyonu (Faz A tamamlandı: `/randevu` sayfasında hizmet başına `wa.me` deep-link; Faz B — Cloud API webhook — bekliyor)
- [ ] **Faz 6:** Cila — animasyonlar, SEO derinleştirme, testler, deploy talimatları

`/randevu` şu an geçici bir sayfa: her hizmet için WhatsApp'a önceden doldurulmuş mesajla yönlendirir. Gerçek çok adımlı randevu sihirbazı Faz 3'te gelecek.

## Ortam Değişkenleri

`.env.example` dosyasına bakın. Faz 2'ye kadar hiçbir değişken zorunlu değildir (site tamamen statik seed veriyle çalışır).

## Hostinger Deploy (Node.js)

1. `npm run build` — `output: "standalone"` sayesinde `.next/standalone` klasörü minimal bir Node sunucusu içerir.
2. **hPanel → Setup Node.js App** ile yeni bir Node uygulaması oluşturun, giriş dosyası olarak `.next/standalone/server.js` gösterin; `.next/static` ve `public/` klasörlerini `.next/standalone/.next/static` ve `.next/standalone/public` altına kopyalayın.
3. Alternatif olarak VPS'te: `pm2 start .next/standalone/server.js --name lumia` + Nginx reverse proxy (443 → 3000).
4. Ortam değişkenlerini (bkz. `.env.example`) Node uygulamasının ortam ayarlarına girin.
5. Backend tamamen Nhost Cloud'da barınır — Hostinger tarafında ekstra veritabanı kurulumu gerekmez.
