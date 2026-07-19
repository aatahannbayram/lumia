import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Gem, HandHeart, Sparkles } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { media } from "@/lib/data/media"
import { getActiveStaffMembers } from "@/lib/admin-staff-store"
import { CtaBand } from "@/components/public/cta-band"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "About" })
  return { title: t("pageTitle"), description: t("heroDescription") }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "About" })
  const staff = getActiveStaffMembers()

  const values = [
    { icon: Sparkles, title: t("valueQualityTitle"), desc: t("valueQualityDesc") },
    { icon: HandHeart, title: t("valueCareTitle"), desc: t("valueCareDesc") },
    { icon: Gem, title: t("valueQualityProductsTitle"), desc: t("valueQualityProductsDesc") },
  ]

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center rounded-full bg-lumia-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lumia-coffee">
              {t("heroEyebrow")}
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight text-lumia-dark sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="max-w-lg text-muted-foreground">{t("heroDescription")}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image
              src={media.salonInteriorMono}
              alt="Lumia salon"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-2xl font-bold text-lumia-dark">
            {t("valuesTitle")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft"
              >
                <value.icon className="h-7 w-7 text-lumia-coffee" />
                <h3 className="mt-4 font-heading text-base font-semibold text-lumia-dark">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-2xl font-bold text-lumia-dark">{t("teamTitle")}</h2>
          <p className="mt-2 max-w-lg text-muted-foreground">{t("teamDescription")}</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {staff.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 font-heading text-base font-semibold text-lumia-dark">
                  {member.name}
                </p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CtaBand />
    </div>
  )
}
