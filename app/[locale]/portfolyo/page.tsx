import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Locale } from "@/i18n/routing"
import { PortfolioGrid } from "@/components/public/portfolio-grid"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Portfolio" })
  return { title: t("pageTitle"), description: t("pageDescription") }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Portfolio" })

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-bold text-lumia-dark sm:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("pageDescription")}</p>
      </div>

      <div className="mt-10">
        <PortfolioGrid />
      </div>
    </div>
  )
}
