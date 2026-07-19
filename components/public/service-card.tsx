"use client"

import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { Clock } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { formatPrice } from "@/lib/format"
import { resolveServiceName } from "@/lib/service-display"
import { cn } from "@/lib/utils"
import type { Service } from "@/types"

export function ServiceCard({
  service,
  featured = false,
  className,
}: {
  service: Service
  categoryIcon?: string
  featured?: boolean
  className?: string
}) {
  const locale = useLocale()
  const t = useTranslations("Services")
  const tItems = useTranslations("ServiceItems")
  const name = resolveServiceName(service, (key) => tItems(key))
  const categoryLabel =
    service.category === "hair" ? t("categoryHair") : t("categoryNail")

  return (
    <Link
      href={`/hizmet/${service.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden bg-lumia-dark text-white",
        featured ? "min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]" : "min-h-[320px]",
        className
      )}
    >
      <Image
        src={service.image}
        alt={name}
        fill
        quality={70}
        sizes={
          featured
            ? "(min-width: 1024px) 66vw, 100vw"
            : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        }
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

      <div className="relative mt-auto flex flex-col p-5 sm:p-6">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
          {categoryLabel}
        </span>
        <h3
          className={cn(
            "mt-2 font-heading font-semibold leading-tight",
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          )}
        >
          {name}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {service.durationMinutes} {t("minutesShort")}
          </span>
          <span className="font-medium text-white">
            {formatPrice(service.priceMinor, locale)}
          </span>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-all duration-300 sm:translate-x-0 sm:opacity-0 sm:group-hover:translate-x-0.5 sm:group-hover:opacity-100">
          {t("detailsCta")}
          <span aria-hidden className="text-lg leading-none">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
