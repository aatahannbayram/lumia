export const site = {
  name: "Lumia",
  legalName: "Lumia C32",
  domain: "lumiaclub.com",
  email: "info@lumiaclub.com",
  phoneRaw: "905396007332",
  phoneDisplay: "+90 539 600 73 32",
  whatsapp: "https://wa.me/905396007332",
  address: {
    street: "Cumhuriyet Mah. Bilgiç Sokak No:17/A",
    district: "Bomonti, Şişli",
    city: "İstanbul",
    country: "TR",
    full: "Cumhuriyet Mah. Bilgiç Sokak No:17/A, Bomonti, Şişli / İstanbul",
  },
  geo: {
    lat: 41.0581028,
    lng: 28.9801857,
  },
  social: {
    instagram: "",
  },
  workingHours: {
    opens: "09:00",
    closes: "20:00",
  },
  priceRange: "₺₺",
} as const

export const phoneHref = `tel:+${site.phoneRaw}`
export const emailHref = `mailto:${site.email}`

export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  site.address.full
)}&output=embed`

export function whatsappHref(message: string) {
  return `${site.whatsapp}?text=${encodeURIComponent(message)}`
}
