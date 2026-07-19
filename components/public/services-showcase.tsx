"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { resolveServiceName } from "@/lib/service-display"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowCircle } from "@/components/public/arrow-circle"
import { SectionHeading } from "@/components/public/section-heading"
import type { Service } from "@/types"

export function ServicesShowcase({ services }: { services: Service[] }) {
  const t = useTranslations("Home")
  const tItems = useTranslations("ServiceItems")
  const tServices = useTranslations("Services")
  const [activeIndex, setActiveIndex] = useState(0)
  const active = services[activeIndex] ?? services[0]

  if (!active) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={t("servicesEyebrow")} title={t("servicesTitle")} />
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/hizmetler">{t("servicesCta")}</Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-4">
        <ul className="flex flex-col">
          {services.map((service, i) => {
            const isActive = i === activeIndex
            const name = resolveServiceName(service, (key) => tItems(key))
            return (
              <li key={service.slug} className="border-b border-border/60 first:border-t">
                <Link
                  href={`/hizmet/${service.slug}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "group flex items-center justify-between gap-4 py-4 pe-2 transition-colors",
                    isActive ? "text-lumia-dark" : "text-foreground/60 hover:text-lumia-dark"
                  )}
                >
                  <span
                    className={cn(
                      "font-heading text-lg transition-all sm:text-xl",
                      isActive ? "font-semibold" : "font-medium"
                    )}
                  >
                    {name}
                  </span>
                  <ArrowCircle
                    size="sm"
                    className={
                      isActive
                        ? "bg-lumia-dark text-white"
                        : "bg-transparent text-foreground/40 ring-1 ring-inset ring-border group-hover:bg-lumia-dark group-hover:text-white group-hover:ring-0"
                    }
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[420px]">
          <Image
            key={active.slug}
            src={active.image}
            alt={resolveServiceName(active, (key) => tItems(key))}
            fill
            quality={70}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <Link
            href={`/hizmet/${active.slug}`}
            className="group absolute end-5 top-5 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pe-1.5 ps-4 text-xs font-semibold text-lumia-dark backdrop-blur-md transition-colors hover:bg-white"
          >
            {tServices("detailsCta")}
            <ArrowCircle size="sm" className="bg-lumia-dark text-white group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  )
}
