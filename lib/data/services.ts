import { media } from "@/lib/data/media"
import type { Service } from "@/types"

export const SERVICES: Service[] = [
  {
    slug: "fon",
    category: "hair",
    priceMinor: 25000,
    durationMinutes: 20,
    image: media.serviceFon,
    gallery: [media.serviceFon, media.heroCardHair],
    active: true,
  },
  {
    slug: "sac-kesim",
    category: "hair",
    priceMinor: 40000,
    durationMinutes: 40,
    image: media.serviceSacKesim,
    gallery: [media.serviceSacKesim, media.serviceFon],
    active: true,
  },
  {
    slug: "sac-boyama",
    category: "hair",
    priceMinor: 120000,
    durationMinutes: 90,
    image: media.serviceSacBoyama,
    gallery: [media.serviceSacBoyama, media.heroCardHair],
    active: true,
  },
  {
    slug: "manikur",
    category: "nail",
    priceMinor: 35000,
    durationMinutes: 40,
    image: media.serviceManikur,
    gallery: [media.serviceManikur, media.heroCardNail],
    active: true,
  },
  {
    slug: "pedikur",
    category: "nail",
    priceMinor: 45000,
    durationMinutes: 50,
    image: media.servicePedikur,
    gallery: [media.servicePedikur],
    active: true,
  },
  {
    slug: "kalici-oje",
    category: "nail",
    priceMinor: 50000,
    durationMinutes: 45,
    image: media.serviceKaliciOje,
    gallery: [media.serviceKaliciOje],
    active: true,
  },
  {
    slug: "protez-tirnak",
    category: "nail",
    priceMinor: 90000,
    durationMinutes: 75,
    image: media.serviceProtezTirnak,
    gallery: [media.serviceProtezTirnak, media.serviceKaliciOje],
    active: true,
  },
]

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug)
}

export function getServicesByCategory(category?: string) {
  if (!category || category === "all") return SERVICES.filter((s) => s.active)
  return SERVICES.filter((s) => s.active && s.category === category)
}
