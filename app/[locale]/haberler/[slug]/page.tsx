import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowLeft, CalendarDays, Share2 } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { getNewsBySlug, getPublishedNewsCached } from "@/lib/admin-news-store"
import { getBreadcrumbJsonLd } from "@/lib/schema"
import { site } from "@/lib/site-config"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const item = getNewsBySlug(slug)
  if (!item) return {}
  const url = `https://${site.domain}/${locale}/haberler/${slug}`
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      url,
      publishedTime: item.date,
      images: [{ url: item.image }],
    },
  }
}

export default async function HaberDetayPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const item = getNewsBySlug(slug)
  if (!item) notFound()

  const t = await getTranslations({ locale, namespace: "News" })
  const related = (await getPublishedNewsCached())
    .filter((n) => n.slug !== slug)
    .slice(0, 3)
  const paragraphs = item.content.split(/\n\n+/).filter(Boolean)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    image: [item.image],
    datePublished: item.date,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `https://${site.domain}/og-image.jpg` },
    },
  }

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Lumia", url: `https://${site.domain}/${locale}` },
    { name: t("pageTitle"), url: `https://${site.domain}/${locale}/haberler` },
    { name: item.title, url: `https://${site.domain}/${locale}/haberler/${slug}` },
  ])

  return (
    <article className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Full-bleed hero */}
      <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden bg-lumia-dark sm:h-[64vh]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

        <div className="absolute inset-x-0 top-0 px-4 pt-28 sm:px-6 sm:pt-32">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/haberler"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("pageTitle")}
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md">
                {item.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs">
                <CalendarDays className="h-3.5 w-3.5" />
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">{item.summary}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative -mt-8 rounded-[1.5rem] border border-border/40 bg-white px-6 py-8 shadow-soft-lg sm:-mt-10 sm:px-10 sm:py-12">
          <div className="space-y-5 text-[15px] leading-[1.8] text-foreground/85 sm:text-base">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6">
            <p className="text-xs text-muted-foreground">{t("shareHint")}</p>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${item.title} — https://${site.domain}/${locale}/haberler/${slug}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Share2 className="h-3.5 w-3.5" />
                {t("share")}
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] bg-lumia-dark px-6 py-8 text-white sm:px-10">
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">{t("ctaTitle")}</h2>
          <p className="mt-2 max-w-lg text-sm text-white/70">{t("ctaDescription")}</p>
          <Button asChild size="lg" variant="secondary" className="mt-5">
            <Link href="/randevu">{t("ctaButton")}</Link>
          </Button>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-heading text-lg font-semibold text-lumia-dark">
              {t("relatedTitle")}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((n) => (
                <Link
                  key={n.id}
                  href={`/haberler/${n.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border/50 bg-white shadow-soft"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={n.image}
                      alt={n.title}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 font-heading text-sm font-semibold text-lumia-dark">
                      {n.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
