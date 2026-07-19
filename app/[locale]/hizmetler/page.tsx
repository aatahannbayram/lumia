import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { ServicesFilterGrid } from "@/components/public/services-filter-grid"
import { CtaBand } from "@/components/public/cta-band"
import { Button } from "@/components/ui/button"
import { getAdminCategories } from "@/lib/admin-catalog-store"
import { media } from "@/lib/data/media"
import { getPublicServices } from "@/lib/public-catalog"
import { site } from "@/lib/site-config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Services" })
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `https://${site.domain}/${locale}/hizmetler`,
    },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Services" })
  const categories = getAdminCategories().map((c) => ({ id: c.id, icon: c.icon }))
  const services = getPublicServices()

  return (
    <>
      <section className="relative min-h-[52vh] overflow-hidden bg-lumia-dark sm:min-h-[58vh]">
        <Image
          src={media.salonInteriorMono}
          alt={t("pageTitle")}
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lumia-dark via-lumia-dark/55 to-lumia-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-lumia-dark/50 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 sm:min-h-[58vh] sm:px-6 sm:pb-16 sm:pt-32">
          <p className="animate-fade-up font-heading text-sm font-semibold tracking-[0.28em] text-white/90 sm:text-base">
            LUMIA
          </p>
          <h1 className="animate-fade-up mt-3 max-w-xl font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: "80ms" }}>
            {t("pageTitle")}
          </h1>
          <p className="animate-fade-up mt-4 max-w-lg text-base text-white/75 sm:text-lg" style={{ animationDelay: "140ms" }}>
            {t("pageDescription")}
          </p>
          <div className="animate-fade-up mt-8" style={{ animationDelay: "200ms" }}>
            <Button asChild size="lg" variant="secondary">
              <Link href="/randevu">{t("book")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <ServicesFilterGrid categories={categories} services={services} />
      </div>

      <CtaBand />
    </>
  )
}
