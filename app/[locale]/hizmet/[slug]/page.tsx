import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Clock, Tag } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/public/service-card"
import {
  getAllPublicServiceSlugs,
  getPublicServiceBySlug,
  getPublicServices,
} from "@/lib/public-catalog"
import {
  resolveServiceDescription,
  resolveServiceName,
  resolveServiceShortDescription,
} from "@/lib/service-display"
import { formatPrice } from "@/lib/format"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return getAllPublicServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const service = getPublicServiceBySlug(slug)
  if (!service) return {}
  const t = await getTranslations({ locale, namespace: "ServiceItems" })
  const name = resolveServiceName(service, (key) => t(key))
  const description = resolveServiceShortDescription(service, (key) => t(key))
  return { title: name, description: description || undefined }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const service = getPublicServiceBySlug(slug)
  if (!service) notFound()

  const t = await getTranslations({ locale, namespace: "Services" })
  const tItems = await getTranslations({ locale, namespace: "ServiceItems" })
  const tCategories = await getTranslations({ locale, namespace: "ServiceCategories" })

  const name = resolveServiceName(service, (key) => tItems(key))
  const shortDescription = resolveServiceShortDescription(service, (key) => tItems(key))
  const description = resolveServiceDescription(service, (key) => tItems(key))

  const related = getPublicServices()
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <nav className="text-sm text-muted-foreground">
        <Link href="/hizmetler" className="hover:text-foreground">
          {t("pageTitle")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
          <Image
            src={service.image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lumia-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lumia-coffee">
              <Tag className="h-3.5 w-3.5" />
              {tCategories(service.category)}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold text-lumia-dark sm:text-4xl">
              {name}
            </h1>
            {shortDescription && (
              <p className="mt-3 text-muted-foreground">{shortDescription}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3">
              <Clock className="h-4 w-4 text-lumia-coffee" />
              <span className="text-sm font-medium">
                {service.durationMinutes} {t("minutesShort")}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3">
              <span className="text-xs text-muted-foreground">{t("priceFrom")}</span>
              <span className="font-heading text-sm font-semibold text-lumia-dark">
                {formatPrice(service.priceMinor, locale)}
              </span>
            </div>
          </div>

          <Button asChild size="lg" className="w-fit">
            <Link href="/randevu">{t("book")}</Link>
          </Button>

          {description && (
            <div className="border-t border-border/60 pt-6">
              <h2 className="font-heading text-lg font-semibold text-lumia-dark">
                {t("detailDescriptionTitle")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
            </div>
          )}
        </div>
      </div>

      {service.gallery.length > 1 && (
        <div className="mt-16">
          <h2 className="font-heading text-lg font-semibold text-lumia-dark">
            {t("detailGalleryTitle")}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {service.gallery.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={img}
                  alt={`${name} ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-lg font-semibold text-lumia-dark">
            {t("relatedTitle")}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} className="min-h-[280px]" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
