"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { PORTFOLIO_ITEMS } from "@/lib/data/portfolio"
import type { ServiceCategoryId } from "@/types"

type Filter = "all" | ServiceCategoryId

export function PortfolioGrid() {
  const t = useTranslations("Portfolio")
  const tCategories = useTranslations("ServiceCategories")
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(
    () =>
      filter === "all"
        ? PORTFOLIO_ITEMS
        : PORTFOLIO_ITEMS.filter((item) => item.category === filter),
    [filter]
  )

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "hair", label: tCategories("hair") },
    { id: "nail", label: tCategories("nail") },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              filter === f.id
                ? "bg-lumia-dark text-white"
                : "bg-muted text-foreground/70 hover:bg-muted/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-2 gap-4 sm:columns-3">
        {filtered.map((item) => (
          <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl">
            <Image
              src={item.image}
              alt={item.alt}
              width={600}
              height={600}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
