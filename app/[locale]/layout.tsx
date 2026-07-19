import type { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { Toaster } from "sonner"

import { locales, rtlLocales, type Locale } from "@/i18n/routing"
import { poppins, notoKufiArabic, notoSansArabic } from "@/lib/fonts"
import { site } from "@/lib/site-config"
import { getLocalBusinessJsonLd } from "@/lib/schema"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { NhostAppProvider } from "@/components/providers/nhost-provider"
import "@/app/globals.css"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Hero" })
  const description = t("description")

  return {
    metadataBase: new URL(`https://${site.domain}`),
    title: {
      default: "Lumia — Bomonti Güzellik Merkezi | Saç & Tırnak",
      template: "%s | Lumia",
    },
    description,
    keywords: [
      "güzellik salonu",
      "Bomonti",
      "Şişli",
      "saç bakımı",
      "tırnak bakımı",
      "balyaj",
      "kalıcı oje",
      "Lumia",
    ],
    alternates: {
      canonical: `https://${site.domain}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `https://${site.domain}/${l}`])),
    },
    openGraph: {
      title: "Lumia — Bomonti Güzellik Merkezi",
      description,
      url: `https://${site.domain}/${locale}`,
      siteName: "Lumia",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Lumia — Bomonti Güzellik Merkezi",
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: "EQx_X5kmRAzS_-I8n7x0_FqTkSsUvjEqOhqa41v3aMc",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr"

  const tHero = await getTranslations({ locale, namespace: "Hero" })
  const jsonLd = getLocalBusinessJsonLd({ locale, description: tHero("description") })
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

  const fontVars =
    dir === "rtl"
      ? ({
          "--font-heading": "var(--font-noto-kufi-arabic)",
          "--font-body": "var(--font-noto-sans-arabic)",
        } as React.CSSProperties)
      : ({
          "--font-heading": "var(--font-poppins)",
          "--font-body": "var(--font-poppins)",
        } as React.CSSProperties)

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${poppins.variable} ${notoKufiArabic.variable} ${notoSansArabic.variable}`}
    >
      <body style={fontVars}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <NhostAppProvider>
            <LenisProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster richColors position="top-center" />
            </LenisProvider>
          </NhostAppProvider>
        </NextIntlClientProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}
