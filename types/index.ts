export type ServiceCategoryId = "hair" | "nail"

export interface Service {
  slug: string
  category: ServiceCategoryId
  /** Price in minor currency units (kuruş) */
  priceMinor: number
  durationMinutes: number
  image: string
  gallery: string[]
  active: boolean
  /** Admin catalog display name (overrides i18n when set) */
  catalogName?: string
  catalogDescription?: string
}

export interface PortfolioItem {
  id: string
  category: ServiceCategoryId
  image: string
  alt: string
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number
  quoteKey: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
  photo: string
}
