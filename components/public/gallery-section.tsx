import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/public/section-heading"
import { PORTFOLIO_ITEMS } from "@/lib/data/portfolio"

export function GallerySection() {
  const t = useTranslations("Home")
  const items = PORTFOLIO_ITEMS.slice(0, 4)

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("galleryEyebrow")}
          title={t("galleryTitle")}
          description={t("gallerySubtitle")}
          align="center"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                quality={65}
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/portfolyo">{t("galleryCta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
