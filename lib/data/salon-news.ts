export interface SalonNewsItem {
  id: string
  title: string
  summary: string
  date: string
  tag: string
  /** Optional public blog slug to deep-link */
  blogSlug?: string
}

export const SALON_NEWS: SalonNewsItem[] = [
  {
    id: "1",
    title: "Yaz bakım sezonu başladı",
    summary:
      "Güneş ve deniz sonrası saç ve tırnak bakım paketlerimiz %15 indirimli. Randevunuzu hemen alın!",
    date: "2026-07-18",
    tag: "Kampanya",
    blogSlug: "yazinda-sac-bakimi-deniz-gunes",
  },
  {
    id: "2",
    title: "Yeni balyaj tekniği stüdyomuzda",
    summary:
      "Soft balyaj ve face-framing highlight uygulamaları artık Lumia'da. Renk uzmanımız Zeynep ile tanışın.",
    date: "2026-07-17",
    tag: "Hizmet",
    blogSlug: "balyaj-mi-ombre-mi-hangi-teknik",
  },
  {
    id: "3",
    title: "Kalıcı oje koleksiyonu güncellendi",
    summary:
      "2026 yaz trendlerinden 24 yeni renk stoklarımıza eklendi. İlk deneyen müşterilere mini hediye!",
    date: "2026-07-16",
    tag: "Ürün",
    blogSlug: "kalici-oje-ne-kadar-dayanir",
  },
  {
    id: "4",
    title: "Açılış kuponu hâlâ geçerli",
    summary:
      "ACILIS10 kodu ile tüm hizmetlerde %10 indirim devam ediyor. Online randevu ile otomatik uygulanır.",
    date: "2026-07-15",
    tag: "Kampanya",
  },
  {
    id: "5",
    title: "WhatsApp hatırlatma aktif",
    summary:
      "Randevunuzdan 24 saat önce WhatsApp ile otomatik hatırlatma mesajı gönderiyoruz. Numaranızı güncel tutun.",
    date: "2026-07-14",
    tag: "Duyuru",
    blogSlug: "online-randevu-avantajlari-guzellik-salonu",
  },
  {
    id: "6",
    title: "Organik bakım serisi",
    summary:
      "Saç maskesi ve el bakımında paraben-free, vegan formül ürünlere geçiş yaptık. Cildinize daha nazik.",
    date: "2026-07-12",
    tag: "Ürün",
  },
  {
    id: "7",
    title: "Gelin saçı & makyaj paketi",
    summary:
      "Düğün sezonu için prova + düğün günü paketi. Erken rezervasyona özel fiyat — iletişime geçin.",
    date: "2026-07-10",
    tag: "Paket",
    blogSlug: "gelin-saci-makyaj-paketi-ipuclari",
  },
  {
    id: "8",
    title: "Google yorumlarımız 4.9 oldu",
    summary:
      "Son 30 günde 18 yeni 5 yıldızlı yorum aldık. Bizi tercih eden tüm müşterilerimize teşekkürler!",
    date: "2026-07-08",
    tag: "Başarı",
  },
  {
    id: "9",
    title: "Cumartesi uzatılmış saatler",
    summary:
      "Temmuz–Ağustos döneminde cumartesi 09:00–21:00 arası hizmet veriyoruz. Pazar kapalı.",
    date: "2026-07-05",
    tag: "Duyuru",
  },
  {
    id: "10",
    title: "Arkadaşını getir, ikiniz de kazanın",
    summary:
      "Referans programı: Getirdiğiniz arkadaşın ilk randevusundan sonra bir sonraki ziyaretinizde %20 indirim.",
    date: "2026-07-01",
    tag: "Kampanya",
  },
]
