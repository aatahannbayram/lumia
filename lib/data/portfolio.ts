import { media } from "@/lib/data/media"
import type { PortfolioItem } from "@/types"

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: "p1", category: "hair", image: media.serviceFon, alt: "Fön ve saç şekillendirme" },
  { id: "p2", category: "hair", image: media.heroCardHair, alt: "Parlak dalgalı saç" },
  { id: "p3", category: "hair", image: media.serviceSacBoyama, alt: "Profesyonel saç boyama" },
  { id: "p4", category: "hair", image: media.hairTexture, alt: "Soft beauty close-up" },
  { id: "p5", category: "nail", image: media.heroCardNail, alt: "Lüks tırnak bakımı" },
  { id: "p6", category: "nail", image: media.serviceKaliciOje, alt: "Kalıcı oje uygulaması" },
  { id: "p7", category: "nail", image: media.serviceProtezTirnak, alt: "Tırnak sanatı" },
  { id: "p8", category: "nail", image: media.serviceManikur, alt: "Doğal manikür detayı" },
]
