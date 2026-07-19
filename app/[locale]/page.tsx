import { setRequestLocale } from "next-intl/server"

import type { Locale } from "@/i18n/routing"
import { Hero } from "@/components/public/hero"
import { IntroSection } from "@/components/public/intro-section"
import { ServicesShowcase } from "@/components/public/services-showcase"
import { SpotlightSection } from "@/components/public/spotlight-section"
import { TransformationSection } from "@/components/public/transformation-section"
import { GallerySection } from "@/components/public/gallery-section"
import { TestimonialsSection } from "@/components/public/testimonials-section"
import { LocationSection } from "@/components/public/location-section"
import { NewsTeaser } from "@/components/public/news-teaser"
import { CtaBand } from "@/components/public/cta-band"
import { getPublicServiceBySlug, getPublicServices } from "@/lib/public-catalog"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const services = getPublicServices()
  const spotlightService =
    getPublicServiceBySlug("sac-boyama") ?? services[0]

  return (
    <>
      <Hero />
      <IntroSection />
      <ServicesShowcase services={services} />
      {spotlightService && <SpotlightSection service={spotlightService} />}
      <TransformationSection />
      <GallerySection />
      <TestimonialsSection />
      <NewsTeaser locale={locale} />
      <LocationSection />
      <CtaBand />
    </>
  )
}
