# Lumia — Yol Haritası

Bu dosya, üzerinde konuşulan ama henüz yapılmamış (veya kısmen yapılmış) işleri tek yerden takip etmek için var. Her blok tamamlandığında burayı güncelle.

---

## ✅ Tamamlanan (özet)

- **Faz 0-1:** Next.js + i18n (TR/EN/AR-RTL/RU) + tüm public vitrin sayfaları
- **İşletme bilgileri (NAP):** `lib/site-config.ts` tek kaynak, schema.org JSON-LD
- **Hero:** Tam ekran, embla carousel + Ken Burns, arch-shaped glass ikon kartları
- **Header:** Fixed + glass, sayfaya göre opak/saydam, altı çizili aktif link
- **Hizmetlerimiz (Anasayfa):** Ok-listesi + hover'da değişen büyük görsel showcase
- **Randevu sistemi (interim, Nhost öncesi):**
  - Sepet mantığıyla çoklu hizmet seçimi
  - Gerçek takvim + saat seçimi (`components/public/booking-calendar.tsx`)
  - Müsaitlik motoru (`lib/availability.ts`) — dolu saatler hem listelenmez hem de sunucu tarafında POST anında tekrar doğrulanır (409 = "slot_taken")
  - Onayda **hem** `/api/appointments`'a kaydediliyor **hem de** WhatsApp'a önceden doldurulmuş mesajla yönlendiriliyor
  - Veri şu an `data/appointments.json` dosyasında tutuluyor (Hostinger Node.js sürekli çalıştığı için dosya tabanlı depolama kalıcı — Faz 2'de Nhost/Postgres'e taşınacak)
- **Admin panel (interim):** `/admin` — Basic Auth korumalı (`ADMIN_USER`/`ADMIN_PASSWORD` env), randevuları liste halinde gösteriyor (yaklaşan / geçmiş)
- **Tasarım:** Ana buton rengi kahverengiden siyaha (`--primary`) çevrildi, büyük border-radius değerleri (rounded-3xl / rounded-[2rem] / rounded-[2.5rem]) genel olarak bir kademe küçültüldü

---

## 🔜 Bu turdan kalanlar (Increment #3 — 6 bileşen)

Component 1 (Hero) ve Component 2 (Hizmetlerimiz ok-listesi) tamamlandı. Kalanlar:

- [ ] **Component 3 — "Öne Çıkan":** Dönen dairesel yazı halkalı showcase (SVG `textPath`, sonsuz rotate) — şu an `spotlight-section.tsx` bunun sadeleştirilmiş hali, referanstaki dönen yazı efekti eksik.
- [ ] **Component 4 — "Eşsiz Dönüşüm" mozaiği:** Mevcut `transformation-section.tsx` var ama "daha modüler ve şık" geçişinden sonra tekrar gözden geçirilmeli (glass altyazı, hover parıltı efekti netleştirilebilir).
- [ ] **Component 5 — "Popüler Hizmetler / Katalog":** Arama kutulu, kart grid'li bölüm — henüz yok.

---

## ✅ B) E-posta Gönderimi (SMTP — Hostinger) — TAMAMLANDI

- `nodemailer` kuruldu, `lib/mailer.ts` — server-only transport + `sendMail()` helper. `EMAIL_PASSWORD` boşsa (yerel geliştirmede olduğu gibi) sessizce atlanır, hiçbir şeyi çökertmez (log'a uyarı düşer).
- `.env.local` / `.env.example`'a `EMAIL_HOST/PORT/USER/PASSWORD/FROM` eklendi. **`EMAIL_PASSWORD` gerçek Hostinger posta kutusu şifresiyle doldurulmalı** (repo'ya girmez, sadece `.env.local` / production ortam değişkeni).
- `lib/email-templates.ts` — Lumia marka renkli, 4 dile göre lokalize (TR/EN/AR-RTL/RU) HTML şablonlar: iletişim formu bildirimi, randevu bildirimi (işletmeye), randevu onayı (müşteriye, opsiyonel).
- `/app/api/contact/route.ts` — iletişim formunu `info@lumiaclub.com`'a e-posta olarak gönderiyor. `contact-form.tsx` hem bu endpoint'e hem WhatsApp'a gönderiyor (senkron `window.open` + async fetch sonrası yönlendirme deseniyle, popup blocker'a takılmadan).
- `/api/appointments/route.ts` — randevu oluşunca **işletmeye her zaman**, **müşteriye e-posta verdiyse ona da** bildirim gönderiyor (fire-and-forget, randevu kaydını bekletmiyor).
- Booking formuna opsiyonel "E-posta" alanı eklendi (`Booking.formEmail`).
- **IMAP notu:** `imap.hostinger.com` sadece işletmenin kendi mail istemcisi içindir, kodda kullanılmadı.

**Kalan:** Gerçek `EMAIL_PASSWORD` girilip Hostinger SMTP ile canlı test edilmeli (yerel ortamda credential olmadığı için sadece "skip" davranışı doğrulandı).

---

## 🔜 Sonraki Bloklar (özet)

- **C) Analytics:** GA4 (`@next/third-parties/google`), consent banner (KVKK), `booking_completed`/`whatsapp_click` custom event'leri. GA MCP sadece geliştirici aracı, koda girmeyecek.
- **Faz 2 — Nhost:** Gerçek Postgres + Hasura + Auth + Storage. `data/appointments.json` → Nhost `appointments` tablosuna taşınacak. `ADMIN_USER`/`ADMIN_PASSWORD` Basic Auth → Hasura role-based auth'a taşınacak.
- **Faz 3 — Tam randevu sihirbazı:** Personel seçimi + personel bazlı müsaitlik (şu an işletme geneli tek havuz).
- **Faz 4 — Tam Admin/CRM:** Müşteriler, hizmetler CRUD, personel, kampanyalar, KPI dashboard (Recharts).
- **Faz 5 — AI chat botu + WhatsApp Cloud API (Faz B):** Şu an sadece `wa.me` deep-link (Faz A) var.
- **Faz 6 — Cila:** SEO derinleştirme, testler, deploy talimatları.
