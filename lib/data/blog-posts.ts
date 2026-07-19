import { media } from "@/lib/data/media"

export interface BlogPost {
  slug: string
  title: string
  description: string
  /** Short paragraphs for article body */
  paragraphs: string[]
  publishedAt: string
  updatedAt?: string
  tags: string[]
  coverImage: string
  readingMinutes: number
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sisli-bomonti-sac-bakimi-rehberi",
    title: "Şişli Bomonti’de Saç Bakımı: Doğru Salon Nasıl Seçilir?",
    description:
      "Bomonti ve Şişli’de saç bakımı için salon seçerken nelere dikkat etmelisiniz? Lumia Beauty uzmanlarından pratik rehber.",
    publishedAt: "2026-07-10",
    tags: ["saç bakımı", "Bomonti", "Şişli"],
    coverImage: media.serviceSacKesim,
    readingMinutes: 6,
    paragraphs: [
      "İstanbul’un yoğun temposunda saç bakımı çoğu zaman aceleye gelir. Oysa doğru salon seçimi, hem saç sağlığınızı korur hem de zaman kazandırır. Özellikle Şişli Bomonti’de seçenekler fazla olduğu için kriterleri netleştirmek önemlidir.",
      "İlk bakmanız gereken nokta uzman kadro ve kullanılan ürünlerdir. Profesyonel boya, bakım ve fön uygulamalarında kaliteli formüller fark yaratır. Ayrıca hijyen, randevu düzeni ve iletişim şeffaflığı da uzun vadeli memnuniyeti belirler.",
      "Lumia Beauty’de saç kesim, fön ve boyama süreçlerini ihtiyacınıza göre planlıyoruz. Online randevu ile dakikalar içinde saat seçebilir, WhatsApp üzerinden onay alabilirsiniz.",
      "Bomonti merkezli konumumuz sayesinde Şişli, Nişantaşı ve çevre mahallelerden kolayca ulaşabilirsiniz. İlk ziyaretinizde saç tipinize uygun bakım önerisi almanız için kısa bir danışmanlık yapıyoruz.",
    ],
  },
  {
    slug: "balyaj-mi-ombre-mi-hangi-teknik",
    title: "Balyaj mı Ombre mi? 2026’da Hangi Renk Tekniği Size Uygun?",
    description:
      "Balyaj ve ombre farkları, bakım süreleri ve kimlere uygun oldukları. Lumia renk uzmanlarından net karşılaştırma.",
    publishedAt: "2026-07-08",
    tags: ["balyaj", "ombre", "saç boyama"],
    coverImage: media.serviceSacBoyama,
    readingMinutes: 7,
    paragraphs: [
      "Balyaj ve ombre sık karıştırılan iki tekniktir. Balyaj, doğal ışık oyunları veren, kökten uca yumuşak geçişli bir highlight yaklaşımıdır. Ombre ise genelde köklerde daha koyu, uçlarda daha açık ve belirgin bir geçiş sunar.",
      "Günlük bakımı kolay bir görünüm istiyorsanız balyaj çoğu zaman daha sürdürülebilirdir. Daha dramatik bir kontrast arıyorsanız ombre veya soft ombre tercih edilebilir.",
      "Doğru teknik seçimi saç tipiniz, doğal renk tonunuz ve bakım alışkanlıklarınıza bağlıdır. İnce telli saçlarda aşırı açma riskli olabilir; bu yüzden danışmanlık şarttır.",
      "Lumia’da face-framing highlight ve soft balyaj uygulamalarıyla yüz hatlarınızı aydınlatan, doğal duran sonuçlar hedefliyoruz. Randevunuzda renk danışmanlığı ücretsizdir.",
    ],
  },
  {
    slug: "kalici-oje-ne-kadar-dayanir",
    title: "Kalıcı Oje Ne Kadar Dayanır? Bakım İpuçları",
    description:
      "Kalıcı ojenin ömrünü uzatmak için yapmanız ve yapmamanız gerekenler. Profesyonel uygulama sonrası bakım rehberi.",
    publishedAt: "2026-07-06",
    tags: ["kalıcı oje", "tırnak bakımı"],
    coverImage: media.heroCardNail,
    readingMinutes: 5,
    paragraphs: [
      "Kalıcı oje doğru uygulandığında genellikle 10–14 gün formunu korur. Süre; tırnak yapısı, günlük el kullanımı ve çıkarma yöntemine göre değişir.",
      "Ömrü uzatmak için eldiven kullanmak, tırnakları alet gibi kullanmamak ve nemlendirici yağlarla kutikulayı beslemek yeterlidir. Erken soyulma görürseniz zorla çıkarmayın; salona gelin.",
      "Evde sert kimyasallarla çıkarma hem oje kalıntısı bırakır hem tırnak plakasını inceltebilir. Profesyonel çıkarma + bakım kombosu en güvenli yoldur.",
      "Lumia’da 2026 yaz koleksiyonundan onlarca renk seçeneğiyle kalıcı oje uyguluyoruz. İlk deneyiminizde mini hediye kampanyalarımızı sorun.",
    ],
  },
  {
    slug: "yazinda-sac-bakimi-deniz-gunes",
    title: "Yazın Saç Bakımı: Deniz ve Güneşe Karşı Koruma",
    description:
      "Deniz, havuz ve güneş sonrası saç hasarını azaltmak için pratik bakım rutini. Yaz bakım paketi önerileri.",
    publishedAt: "2026-07-04",
    tags: ["yaz bakımı", "saç sağlığı"],
    coverImage: media.introGlow,
    readingMinutes: 6,
    paragraphs: [
      "Yaz aylarında UV, tuz ve klor saçta kuruluk, matlık ve kırık uçlara yol açabilir. Özellikle boyalı saçlar bu dönemde daha fazla nem ve protein desteği ister.",
      "Deniz veya havuz öncesi ıslak saça leave-in bakım uygulamak, sonrasında bol suyla durulamak temel korumadır. Haftada bir nem maskesi rutini de fark yaratır.",
      "Güneş altında uzun süre kalacaksanız şapka veya UV koruyucu sprey kullanın. Isı ile şekillendirmeyi azaltmak da yazın en etkili ‘bakım’ adımlarından biridir.",
      "Lumia’nın yaz bakım paketleri güneş ve deniz sonrası yıpranmayı hedef alır. Online randevu ile hızlıca uygun saati seçebilirsiniz.",
    ],
  },
  {
    slug: "manikur-pedikur-farki-ne-zaman",
    title: "Manikür ve Pedikür: Ne Zaman Yaptırmalısınız?",
    description:
      "Manikür ve pedikür sıklığı, hijyen ve sezonluk bakım önerileri. Tırnak sağlığı için doğru zamanlama.",
    publishedAt: "2026-07-02",
    tags: ["manikür", "pedikür"],
    coverImage: media.serviceManikur,
    readingMinutes: 5,
    paragraphs: [
      "Manikür genelde 2–3 haftada bir, pedikür ise ayda bir yeterli olur. Kalıcı oje kullanıyorsanız ritim uygulamaya göre ayarlanır.",
      "Hijyen, tırnak bakımlarında en kritik konudur. Steril aletler, temiz istasyon ve doğru kesim tekniği enfeksiyon riskini azaltır.",
      "Yazın açık ayakkabı ve sandalet kullanımı pedikürü daha görünür kılar; kışın ise nem kaybına karşı daha yoğun bakım gerekir.",
      "Lumia’da manikür, pedikür ve kalıcı oje hizmetlerini aynı randevuda birleştirerek zamandan tasarruf edebilirsiniz.",
    ],
  },
  {
    slug: "protez-tirnak-bakimi-ve-cikarma",
    title: "Protez Tırnak Bakımı ve Güvenli Çıkarma",
    description:
      "Protez tırnak ne kadar dayanır, dolgu ne zaman yapılır, çıkarma neden salonda yapılmalı? Uzman önerileri.",
    publishedAt: "2026-06-28",
    tags: ["protez tırnak", "tırnak"],
    coverImage: media.serviceProtezTirnak,
    readingMinutes: 6,
    paragraphs: [
      "Protez tırnak doğal tırnağı güçlendiren ve şekil veren bir uygulamadır. Doğru bakımla 2–3 hafta form korunur; ardından dolgu önerilir.",
      "Evde zorla çıkarmak doğal tırnağa zarar verebilir. Aseton banyosu veya kazıma gibi yöntemler profesyonel kontrol olmadan risklidir.",
      "Günlük hayatta uzun protezlerle yazı yazmak veya kapı açmak zorlaşabilir; uzunluk ve şekil yaşam tarzınıza göre seçilmelidir.",
      "Lumia’da protez tırnak, dolgu ve güvenli çıkarma işlemlerini aynı standartta sunuyoruz. İlk randevuda şekil ve uzunluk danışmanlığı yapılır.",
    ],
  },
  {
    slug: "gelin-saci-makyaj-paketi-ipuclari",
    title: "Gelin Saçı ve Makyaj: Prova Neden Şart?",
    description:
      "Düğün günü saç ve makyaj planlaması, prova zamanlaması ve paket seçimi için pratik kontrol listesi.",
    publishedAt: "2026-06-25",
    tags: ["gelin saçı", "düğün"],
    coverImage: media.elegantWoman,
    readingMinutes: 7,
    paragraphs: [
      "Gelin saçı ve makyajda prova, sürprizleri azaltır. Saç tipi, duvak ve elbise yakası prova sırasında netleşir; düğün günü süre kısalır.",
      "Prova için ideal zaman düğünden 2–4 hafta öncedir. Böylece renk veya kesim gibi ön hazırlıklar da planlanabilir.",
      "Fotoğraf ve video ışığı makyajı farklı gösterebilir. Prova sırasında yakın çekim fotoğraf çekmek, istenen finish’i netleştirir.",
      "Lumia’nın gelin paketi prova + düğün gününü kapsar. Erken rezervasyon avantajları için iletişime geçmenizi öneririz.",
    ],
  },
  {
    slug: "online-randevu-avantajlari-guzellik-salonu",
    title: "Online Randevu Neden Daha Kolay? Güzellik Salonu Rehberi",
    description:
      "Telefonla uğraşmadan randevu almak, uygun saati görmek ve hatırlatma almak: modern salon deneyimi.",
    publishedAt: "2026-06-20",
    tags: ["randevu", "dijital"],
    coverImage: media.wellness,
    readingMinutes: 4,
    paragraphs: [
      "Online randevu, müsait saatleri anında görmenizi sağlar. Özellikle akşam ve hafta sonu yoğunluğunda telefon trafiğini azaltır.",
      "WhatsApp onayı ve hatırlatmalar no-show oranını düşürür. Müşteri tarafında da unutulan randevu stresi azalır.",
      "Lumia’da hizmet seçimi, süre ve fiyat özetini randevu ekranında net görürsünüz. Kupon kodlarını da aynı adımda girebilirsiniz.",
      "Bomonti salonumuza gelmeden önce online randevu alarak bekleme süresini minimuma indirin.",
    ],
  },
  {
    slug: "sac-kesim-trendleri-2026",
    title: "2026 Saç Kesim Trendleri: Doğal ve Bakımlı Görünüm",
    description:
      "2026’nın öne çıkan saç kesim trendleri ve yüz şekline göre seçim ipuçları. İstanbul salon önerileri.",
    publishedAt: "2026-06-15",
    tags: ["saç kesim", "trend"],
    coverImage: media.heroCardHair,
    readingMinutes: 6,
    paragraphs: [
      "2026’da saç kesiminde abartılı değişimler yerine yüzü çerçeveleyen, bakımı kolay stiller öne çıkıyor. Soft katlar, curtain bangs ve temiz bob varyasyonları popüler.",
      "Trend peşinden koşmak yerine saç tipiniz ve yaşam tarzınız belirleyici olmalı. İnce telli saçlarda aşırı katlandırma hacmi azaltabilir.",
      "Doğru kesim, fön ve bakım ürünleriyle tamamlandığında daha uzun süre form tutar. Bu yüzden kesim sonrası stil önerisi almak önemlidir.",
      "Lumia’da kesim öncesi kısa bir stil danışmanlığı ile yüz hatlarınıza uygun seçenekleri birlikte netleştiriyoruz.",
    ],
  },
  {
    slug: "ilk-kez-guzellik-salonuna-gidenler",
    title: "İlk Kez Güzellik Salonuna Gidenler İçin 8 İpucu",
    description:
      "İlk randevuda ne sorulmalı, nasıl hazırlanmalı? Stresi azaltan pratik checklist.",
    publishedAt: "2026-06-10",
    tags: ["rehber", "ilk randevu"],
    coverImage: media.salonInteriorMono,
    readingMinutes: 5,
    paragraphs: [
      "İlk salonu ziyaretinde beklentinizi net anlatmak işin yarısıdır. Referans fotoğraf, rahatsız olduğunuz noktalar ve günlük bakım sürenizi paylaşın.",
      "Alerji veya hassasiyetiniz varsa mutlaka söyleyin. Özellikle boya ve tırnak ürünlerinde patch/ön değerlendirme gerekebilir.",
      "Randevuya 5–10 dakika erken gelmek form ve danışmanlık için alan açar. Yoğun günlerde geç kalmak uygulamayı kısaltabilir.",
      "Lumia’da sıcak bir karşılama, şeffaf fiyatlandırma ve online randevu ile ilk deneyimi kolaylaştırmayı hedefliyoruz. Sorularınız için WhatsApp hattımız açık.",
    ],
  },
]

export function getAllBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getRelatedBlogPosts(slug: string, limit = 3) {
  const current = getBlogPostBySlug(slug)
  if (!current) return getAllBlogPosts().slice(0, limit)
  return getAllBlogPosts()
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((t) => current.tags.includes(t)))
    .slice(0, limit)
}
