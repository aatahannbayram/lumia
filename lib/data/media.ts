/**
 * Premium Unsplash image bank for Lumia.
 * Lean widths + q=75 for faster LCP; AVIF/WebP via next/image.
 */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=75&w=${w}&auto=format&fit=crop`

export const media = {
  // Hero carousel (slightly larger)
  heroPortrait: u("1522337360788-8b13dee7a37e", 1600),
  heroCardHair: u("1522337094846-8a818192de1f", 1600),
  heroCardNail: u("1632345031435-8727f6897d53", 1400),

  // Intro / atmosphere
  introGlow: u("1616394584738-fc6e612e71b9"),
  beautyEditorial: u("1529626455594-4ff0802cfb7e", 1400),
  softPortrait: "/uploads/intro-portrait.png",
  introPortrait: "/uploads/intro-portrait.png",
  elegantWoman: u("1531746020798-e6953c6e8e04"),
  hairTexture: u("1522335789203-aabd1fc54bc9"),
  spaTreatment: u("1616394584738-fc6e612e71b9"),
  wellness: u("1515377905703-c4788e51af15"),

  // Salon interiors
  salonInteriorMono: u("1633681926022-84c23e8cb2d6"),
  salonInteriorWarm: u("1521590832167-7bcbfaa6381f"),
  spaFlatlay: u("1596462502278-27bfdc403348"),

  // Services
  serviceFon: u("1562322140-8baeececf3df"),
  serviceSacKesim: u("1559599101-f09722fb4948"),
  serviceSacBoyama: "/uploads/sac-boyama.png",
  serviceManikur: u("1610992015732-2449b76344bc"),
  servicePedikur: u("1519415510236-718bdfcd89c8"),
  serviceKaliciOje: u("1604654894610-df63bc536371"),
  serviceProtezTirnak: u("1519014816548-bf5fe059798b"),

  // Team
  team1: u("1544005313-94ddf0286df2"),
  team2: u("1531746020798-e6953c6e8e04"),
  team3: u("1438761681033-6461ffad8d80"),

  // Testimonials (tiny)
  testimonial1: u("1544005313-94ddf0286df2", 160),
  testimonial2: u("1531746020798-e6953c6e8e04", 160),
  testimonial3: u("1529626455594-4ff0802cfb7e", 160),
}
