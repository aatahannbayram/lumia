import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { getPublishedNewsCached } from "@/lib/admin-news-store"
import { Button } from "@/components/ui/button"

export async function NewsTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "News" })
  const items = (await getPublishedNewsCached()).slice(0, 3)

  if (items.length === 0) return null

  return (
    <section className="border-y border-border/40 bg-gradient-to-b from-lumia-cream/40 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-lumia-coffee">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-lumia-dark sm:text-4xl">
              {t("homeTitle")}
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/haberler">
              {t("viewAll")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/haberler/${item.slug}`}
              className="group overflow-hidden rounded-2xl border border-border/40 bg-white shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  quality={65}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-[11px] font-medium text-lumia-coffee">{item.tag}</span>
                <h3 className="mt-1 font-heading text-base font-semibold text-lumia-dark line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
