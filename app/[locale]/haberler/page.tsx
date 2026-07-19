import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { getPublishedNewsCached } from "@/lib/admin-news-store"
import { site } from "@/lib/site-config"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "News" })
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `https://${site.domain}/${locale}/haberler`,
    },
  }
}

export default async function HaberlerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "News" })
  const news = await getPublishedNewsCached()
  const [featured, ...rest] = news

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-lumia-coffee">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-lumia-dark sm:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("pageDescription")}</p>
      </div>

      {featured && (
        <Link
          href={`/haberler/${featured.slug}`}
          className="group relative mt-10 block overflow-hidden rounded-[1.5rem]"
        >
          <div className="relative aspect-[16/9] sm:aspect-[21/9]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              {featured.tag}
            </span>
            <h2 className="mt-3 max-w-2xl font-heading text-2xl font-bold text-white sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">{featured.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white">
              {t("readMore")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item) => (
          <Link
            key={item.id}
            href={`/haberler/${item.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-white shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-lumia-dark/70">
                  {item.tag}
                </span>
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="mt-2 font-heading text-lg font-semibold text-lumia-dark line-clamp-2">
                {item.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {item.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
