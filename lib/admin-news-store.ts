import "server-only"
import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { revalidateTag, unstable_cache } from "next/cache"

import { media } from "@/lib/data/media"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "admin-news.json")

export interface AdminNewsItem {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  image: string
  date: string
  tag: string
  published: boolean
}

const DEFAULT_NEWS: AdminNewsItem[] = [
  {
    id: "1",
    slug: "yaz-bakim-sezonu",
    title: "Yaz bakım sezonu başladı",
    summary:
      "Güneş ve deniz sonrası saç ve tırnak bakım paketlerimiz %15 indirimli. Randevunuzu hemen alın!",
    content:
      "Yaz aylarında UV, tuz ve klor saç ile tırnakları yıpratır. Lumia’da güneş ve deniz sonrası bakım paketlerimizle nem ve parlaklığı geri kazandırıyoruz.\n\nBu sezon seçili paketlerde %15 indirim uyguluyoruz. Online randevu ile uygun saati seçebilir, WhatsApp üzerinden onay alabilirsiniz.\n\nBomonti salonumuzda uzman ekibimizle yaz bakımınızı planlamak için hemen randevu oluşturun.",
    image: media.introGlow,
    date: "2026-07-18",
    tag: "Kampanya",
    published: true,
  },
  {
    id: "2",
    slug: "yeni-balyaj-teknigi",
    title: "Yeni balyaj tekniği stüdyomuzda",
    summary:
      "Soft balyaj ve face-framing highlight uygulamaları artık Lumia'da. Renk uzmanımız Zeynep ile tanışın.",
    content:
      "Soft balyaj ve face-framing highlight, yüzü aydınlatan doğal ışık oyunları sunar. 2026 trendlerinde abartısız, bakımı kolay geçişler öne çıkıyor.\n\nRenk uzmanımız Zeynep, saç tipinize ve cilt tonunuza uygun teknik önerisiyle süreci planlıyor. Prova rengi veya danışmanlık için randevu alırken not bölümüne tercihinizi yazabilirsiniz.\n\nİlk ziyaretinizde renk danışmanlığı ücretsizdir.",
    image: media.serviceSacBoyama,
    date: "2026-07-17",
    tag: "Hizmet",
    published: true,
  },
  {
    id: "3",
    slug: "kalici-oje-koleksiyonu",
    title: "Kalıcı oje koleksiyonu güncellendi",
    summary:
      "2026 yaz trendlerinden 24 yeni renk stoklarımıza eklendi. İlk deneyen müşterilere mini hediye!",
    content:
      "Yaz koleksiyonumuz 24 yeni tonla yenilendi: pastel, neon ve soft nude seçenekler stüdyomuzda sizi bekliyor.\n\nKalıcı oje uygulamasında hijyen ve doğru çıkarma kadar renk seçimi de önemlidir. İlk kez deneyecekseniz uzmanımız kısa bir danışmanlık yapar.\n\nKampanya döneminde ilk kalıcı oje deneyiminde mini hediye sunuyoruz. Detay için resepsiyon veya WhatsApp hattımızdan bilgi alabilirsiniz.",
    image: media.heroCardNail,
    date: "2026-07-16",
    tag: "Ürün",
    published: true,
  },
  {
    id: "4",
    slug: "acilis-kuponu",
    title: "Açılış kuponu hâlâ geçerli",
    summary:
      "ACILIS10 kodu ile tüm hizmetlerde %10 indirim devam ediyor. Online randevu ile otomatik uygulanır.",
    content:
      "Açılış kutlamamız sürüyor. ACILIS10 kodunu online randevu adımında girerek tüm hizmetlerde %10 indirimden yararlanabilirsiniz.\n\nKupon, uygun hizmetlerde otomatik düşülür. Kampanya stok ve süreyle sınırlıdır; dilediğiniz zaman randevu ekranından kontrol edebilirsiniz.",
    image: media.spaFlatlay,
    date: "2026-07-15",
    tag: "Kampanya",
    published: true,
  },
  {
    id: "5",
    slug: "whatsapp-hatirlatma",
    title: "WhatsApp hatırlatma aktif",
    summary:
      "Randevunuzdan 24 saat önce WhatsApp ile otomatik hatırlatma mesajı gönderiyoruz. Numaranızı güncel tutun.",
    content:
      "Randevuları unutmamak için 24 saat kala WhatsApp hatırlatması gönderiyoruz. Böylece hem sizin hem salonumuzun planı daha düzenli ilerler.\n\nNumaranızın doğru olduğundan emin olun. Değişiklik için resepsiyonu bilgilendirmeniz yeterlidir.\n\nOnline randevu sistemimizle hizmet seçimi, süre ve fiyat özetini peşinen görürsünüz.",
    image: media.salonInteriorWarm,
    date: "2026-07-14",
    tag: "Duyuru",
    published: true,
  },
  {
    id: "6",
    slug: "organik-bakim-serisi",
    title: "Organik bakım serisi",
    summary:
      "Saç maskesi ve el bakımında paraben-free, vegan formül ürünlere geçiş yaptık. Cildinize daha nazik.",
    content:
      "Hassas cilt ve saçlar için paraben-free, vegan formüllü bakım ürünlerine geçtik. Maske ve el bakımı uygulamalarımızda bu seriyi tercih ediyoruz.\n\nÜrün seçiminde alerji veya hassasiyetiniz varsa lütfen randevu notuna yazın; alternatif protokol uygulayalım.",
    image: media.wellness,
    date: "2026-07-12",
    tag: "Ürün",
    published: true,
  },
  {
    id: "7",
    slug: "gelin-paketi",
    title: "Gelin saçı & makyaj paketi",
    summary:
      "Düğün sezonu için prova + düğün günü paketi. Erken rezervasyona özel fiyat — iletişime geçin.",
    content:
      "Gelin saçı ve makyajda prova, düğün günü sürprizlerini azaltır. Paketimiz prova + düğün gününü kapsar.\n\nİdeal prova zamanı düğünden 2–4 hafta öncesidir. Erken rezervasyonda özel fiyat avantajı sunuyoruz.\n\nDetaylı bilgi ve müsaitlik için iletişime geçin veya online randevu oluşturun.",
    image: media.elegantWoman,
    date: "2026-07-10",
    tag: "Paket",
    published: true,
  },
  {
    id: "8",
    slug: "google-yorumlari",
    title: "Google yorumlarımız 4.9 oldu",
    summary:
      "Son 30 günde 18 yeni 5 yıldızlı yorum aldık. Bizi tercih eden tüm müşterilerimize teşekkürler!",
    content:
      "Sizden gelen geri bildirimler bizim için en değerli ölçüttür. Son 30 günde 18 yeni 5 yıldızlı Google yorumu aldık; genel puanımız 4.9.\n\nDeneyiminizi paylaşmak isterseniz Google üzerinden yorum bırakabilirsiniz. Teşekkürler!",
    image: media.softPortrait,
    date: "2026-07-08",
    tag: "Başarı",
    published: true,
  },
  {
    id: "9",
    slug: "cumartesi-uzatilmis-saatler",
    title: "Cumartesi uzatılmış saatler",
    summary:
      "Temmuz–Ağustos döneminde cumartesi 09:00–21:00 arası hizmet veriyoruz. Pazar kapalı.",
    content:
      "Yaz yoğunluğuna özel cumartesi günleri 09:00–21:00 arası hizmet veriyoruz. Pazar günleri kapalıyız.\n\nAkşam saatleri hızla dolduğu için online randevu almanızı öneririz.",
    image: media.salonInteriorMono,
    date: "2026-07-05",
    tag: "Duyuru",
    published: true,
  },
  {
    id: "10",
    slug: "arkadasini-getir",
    title: "Arkadaşını getir, ikiniz de kazanın",
    summary:
      "Referans programı: Getirdiğiniz arkadaşın ilk randevusundan sonra bir sonraki ziyaretinizde %20 indirim.",
    content:
      "Referans programımız aktif: Arkadaşınızı getirin, onun ilk randevusu tamamlandıktan sonra bir sonraki ziyaretinizde %20 indirim kazanın.\n\nKampanya koşulları resepsiyonda ve WhatsApp hattımızda detaylandırılır. Aynı anda birden fazla referansı biriktirebilirsiniz.",
    image: media.beautyEditorial,
    date: "2026-07-01",
    tag: "Kampanya",
    published: true,
  },
]

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_NEWS, null, 2), "utf-8")
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

function uniqueSlug(title: string, existing: string[], currentId?: string) {
  const base = slugify(title) || "haber"
  if (!existing.includes(base)) return base
  let i = 2
  while (existing.includes(`${base}-${i}`)) i++
  return `${base}-${i}`
}

export function getNewsItems(): AdminNewsItem[] {
  ensureStore()
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as AdminNewsItem[]
    return parsed.length ? parsed : DEFAULT_NEWS
  } catch {
    return DEFAULT_NEWS
  }
}

export function getPublishedNews(): AdminNewsItem[] {
  return getNewsItems()
    .filter((n) => n.published)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Cached for public pages — busted on admin write */
export const getPublishedNewsCached = unstable_cache(
  async () => getPublishedNews(),
  ["lumia-published-news"],
  { revalidate: 60, tags: ["lumia-published-news"] }
)

function bustNewsCache() {
  try {
    revalidateTag("lumia-published-news")
  } catch {
    /* outside request context */
  }
}

export function getNewsBySlug(slug: string): AdminNewsItem | undefined {
  return getPublishedNews().find((n) => n.slug === slug)
}

export function getNewsById(id: string): AdminNewsItem | undefined {
  return getNewsItems().find((n) => n.id === id)
}

export function createNewsItem(
  input: Omit<AdminNewsItem, "id" | "slug"> & { slug?: string }
) {
  const items = getNewsItems()
  const slugs = items.map((n) => n.slug)
  const slug = input.slug?.trim()
    ? slugify(input.slug)
    : uniqueSlug(input.title, slugs)
  if (slugs.includes(slug)) return null

  const item: AdminNewsItem = {
    id: randomUUID(),
    slug,
    title: input.title,
    summary: input.summary,
    content: input.content,
    image: input.image || media.salonInteriorWarm,
    date: input.date || new Date().toISOString().slice(0, 10),
    tag: input.tag || "Duyuru",
    published: input.published ?? true,
  }
  items.unshift(item)
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8")
  bustNewsCache()
  return item
}

export function updateNewsItem(id: string, patch: Partial<AdminNewsItem>) {
  const items = getNewsItems()
  const index = items.findIndex((n) => n.id === id)
  if (index === -1) return null

  const next = { ...items[index], ...patch, id }
  if (patch.title && !patch.slug) {
    const others = items.filter((n) => n.id !== id).map((n) => n.slug)
    if (patch.title !== items[index].title) {
      next.slug = uniqueSlug(patch.title, others)
    }
  } else if (patch.slug) {
    next.slug = slugify(patch.slug)
    const clash = items.some((n) => n.id !== id && n.slug === next.slug)
    if (clash) next.slug = uniqueSlug(next.slug, items.filter((n) => n.id !== id).map((n) => n.slug))
  }

  items[index] = next
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8")
  bustNewsCache()
  return next
}

export function deleteNewsItem(id: string) {
  const items = getNewsItems().filter((n) => n.id !== id)
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8")
  bustNewsCache()
  return true
}
