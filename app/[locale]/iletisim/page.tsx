import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { site, phoneHref, emailHref, mapEmbedSrc, whatsappHref } from "@/lib/site-config"
import { ContactForm } from "@/components/public/contact-form"
import { WhatsAppIcon } from "@/components/public/whatsapp-icon"
import { Button } from "@/components/ui/button"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Contact" })
  return { title: t("pageTitle"), description: t("pageDescription") }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Contact" })

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="max-w-2xl">
        <h1 className="font-heading text-4xl font-bold text-lumia-dark sm:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("pageDescription")}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft sm:p-8">
            <ContactForm />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="dark" size="lg" className="gap-2">
              <a href={whatsappHref("Merhaba Lumia, bir sorum var.")} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="h-4 w-4" />
                {t("whatsappCta")}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={phoneHref}>
                <Phone className="h-4 w-4" />
                {t("callCta")}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={emailHref}>
                <Mail className="h-4 w-4" />
                {t("emailTitle")}
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-[1.25rem] border border-border/60 shadow-soft">
            <iframe
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lumia konum haritası"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {t("addressTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{site.address.full}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {t("hoursTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t("hoursValue")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5 sm:col-span-2">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {t("emailTitle")}
                </p>
                <a
                  href={emailHref}
                  className="mt-1 block text-sm text-muted-foreground hover:text-foreground"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
