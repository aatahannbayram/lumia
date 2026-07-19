"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { ServiceCard } from "@/components/public/service-card"
import type { Service, ServiceCategoryId } from "@/types"

type Filter = "all" | ServiceCategoryId

export interface PublicCategoryMeta {
  id: ServiceCategoryId
  icon?: string
}

interface ServicesFilterGridProps {
  categories?: PublicCategoryMeta[]
  services: Service[]
}

export function ServicesFilterGrid({ services }: ServicesFilterGridProps) {
  const t = useTranslations("Services")
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(
    () => (filter === "all" ? services : services.filter((s) => s.category === filter)),
    [filter, services]
  )

  const [featured, ...rest] = filtered

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "hair", label: t("categoryHair") },
    { id: "nail", label: t("categoryNail") },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60">
        <nav className="flex gap-1" aria-label={t("pageTitle")}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors",
                filter === f.id
                  ? "text-lumia-dark"
                  : "text-muted-foreground hover:text-lumia-dark"
              )}
            >
              {f.label}
              {filter === f.id && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-lumia-dark" />
              )}
            </button>
          ))}
        </nav>
        <p className="pb-3 pe-1 text-xs text-muted-foreground">
          {filtered.length} {t("countLabel")}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">{t("emptyFilter")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
          {featured && (
            <div className="animate-fade-up lg:col-span-7">
              <ServiceCard service={featured} featured />
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-5 lg:grid-cols-1">
            {rest.slice(0, 2).map((service, i) => (
              <div
                key={service.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <ServiceCard service={service} className="min-h-[240px] sm:min-h-[210px] lg:min-h-[232px]" />
              </div>
            ))}
          </div>
          {rest.slice(2).map((service, i) => (
            <div
              key={service.slug}
              className="animate-fade-up sm:col-span-1 lg:col-span-4"
              style={{ animationDelay: `${(i + 3) * 70}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
