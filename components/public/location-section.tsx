import { useTranslations } from "next-intl"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { SectionHeading } from "@/components/public/section-heading"
import { site, phoneHref, emailHref, mapEmbedSrc } from "@/lib/site-config"

export function LocationSection() {
  const t = useTranslations("Home")
  const tContact = useTranslations("Contact")

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t("locationEyebrow")} title={t("locationTitle")} />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-[1.25rem] border border-border/60 shadow-soft">
            <iframe
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 360 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lumia konum haritası"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {tContact("addressTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{site.address.full}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {tContact("hoursTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{tContact("hoursValue")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {tContact("phoneTitle")}
                </p>
                <a
                  href={phoneHref}
                  className="mt-1 block text-sm text-muted-foreground hover:text-foreground"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-5">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-lumia-coffee" />
              <div>
                <p className="font-heading text-sm font-semibold text-lumia-dark">
                  {tContact("emailTitle")}
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
    </section>
  )
}
