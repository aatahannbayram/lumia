import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { media } from "@/lib/data/media"
import { SectionHeading } from "@/components/public/section-heading"
import { Button } from "@/components/ui/button"

export function TransformationSection() {
  const t = useTranslations("Home")

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={t("transformationEyebrow")} title={t("transformationTitle")} />
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/hizmetler">{t("transformationCta")}</Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:grid-rows-2">
        <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-[1.25rem] sm:aspect-auto">
          <Image
            src={media.beautyEditorial}
            alt="Lumia güzellik dönüşümü"
            fill
            quality={65}
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-[1.25rem]">
          <Image
            src={media.heroCardHair}
            alt="Parlak saç şekillendirme"
            fill
            quality={65}
            sizes="(min-width: 640px) 20vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-[1.25rem]">
          <Image
            src={media.heroCardNail}
            alt="Lüks tırnak bakımı"
            fill
            quality={65}
            sizes="(min-width: 640px) 20vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="relative col-span-2 aspect-[2/1] overflow-hidden rounded-[1.25rem] sm:col-span-2 sm:aspect-auto">
          <Image
            src={media.spaTreatment}
            alt="Spa ve bakım detayı"
            fill
            quality={65}
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <Button asChild variant="outline" className="mt-8 w-full sm:hidden">
        <Link href="/hizmetler">{t("transformationCta")}</Link>
      </Button>
    </section>
  )
}
