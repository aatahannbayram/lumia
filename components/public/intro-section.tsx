import Image from "next/image"
import { useTranslations } from "next-intl"
import { Sparkles, HandHeart, Gem } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { media } from "@/lib/data/media"
import { SectionHeading } from "@/components/public/section-heading"
import { ArrowCircle } from "@/components/public/arrow-circle"

export function IntroSection() {
  const t = useTranslations("Home")
  const tAbout = useTranslations("About")

  const values = [
    { icon: Sparkles, title: tAbout("valueQualityTitle"), desc: tAbout("valueQualityDesc") },
    { icon: HandHeart, title: tAbout("valueCareTitle"), desc: tAbout("valueCareDesc") },
    { icon: Gem, title: tAbout("valueQualityProductsTitle"), desc: tAbout("valueQualityProductsDesc") },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
          <Image
            src={media.introPortrait}
            alt="Lumia deneyimi"
            fill
            quality={70}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[center_20%]"
          />
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={t("introEyebrow")}
            title={t("introTitle")}
            description={t("introDescription")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border/60 bg-white p-5 shadow-soft">
                <value.icon className="h-6 w-6 text-lumia-coffee" />
                <h3 className="mt-3 font-heading text-sm font-semibold text-lumia-dark">{value.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/iletisim"
            className="group inline-flex w-fit items-center gap-3 font-heading text-sm font-semibold text-lumia-dark"
          >
            {t("introCta")}
            <ArrowCircle size="sm" />
          </Link>
        </div>
      </div>
    </section>
  )
}
