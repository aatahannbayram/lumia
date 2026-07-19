"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { Sparkle } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { resolveServiceName } from "@/lib/service-display"
import type { Service } from "@/types"

export function SpotlightSection({ service }: { service: Service }) {
  const t = useTranslations("Home")
  const tItems = useTranslations("ServiceItems")
  const tServices = useTranslations("Services")
  const locale = useLocale()
  const name = resolveServiceName(service, (key) => tItems(key))

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid grid-cols-1 items-center gap-10 rounded-[1.5rem] bg-lumia-dark p-8 sm:p-14 lg:grid-cols-2">
        <div className="order-2 flex flex-col gap-5 text-white lg:order-1">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lumia-gold">
            <Sparkle className="h-3.5 w-3.5" />
            {t("spotlightEyebrow")}
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
            {t("spotlightTitle")}
          </h2>
          <p className="max-w-md text-white/70">{t("spotlightSubtitle")}</p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span className="font-heading text-2xl font-bold text-lumia-gold">
              {formatPrice(service.priceMinor, locale)}
            </span>
            <span className="text-sm text-white/60">
              {service.durationMinutes} {tServices("minutesShort")}
            </span>
          </div>

          <Button asChild size="lg" variant="secondary" className="mt-2 w-fit">
            <Link href="/randevu">{t("spotlightCta")}</Link>
          </Button>
        </div>

        <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-[1.25rem] lg:order-2">
          <Image
            src={service.image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
