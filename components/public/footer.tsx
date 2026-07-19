import { useTranslations } from "next-intl"
import { Mail, MapPin, Phone } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { site, phoneHref, emailHref, whatsappHref } from "@/lib/site-config"
import { WhatsAppIcon } from "@/components/public/whatsapp-icon"
import { InstagramIcon } from "@/components/public/instagram-icon"
import { publicNavLinks } from "@/lib/public-nav"

const quickLinks = publicNavLinks

const serviceLinks = [
  { href: "/hizmet/fon", labelKey: "fon" },
  { href: "/hizmet/sac-kesim", labelKey: "sac-kesim" },
  { href: "/hizmet/sac-boyama", labelKey: "sac-boyama" },
  { href: "/hizmet/manikur", labelKey: "manikur" },
  { href: "/hizmet/pedikur", labelKey: "pedikur" },
] as const

export function Footer() {
  const tNav = useTranslations("Nav")
  const tFooter = useTranslations("Footer")
  const tServices = useTranslations("ServiceItems")

  return (
    <footer className="mt-24 border-t border-border/60 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <span className="font-heading text-2xl font-bold text-lumia-dark">{site.name}</span>
            <p className="max-w-xs text-sm text-muted-foreground">{tFooter("description")}</p>
            <div className="flex items-center gap-3 pt-2">
              {site.social.instagram && (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              <a
                href={whatsappHref("Merhaba Lumia, randevu almak istiyorum.")}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={phoneHref}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
                aria-label="Call"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={emailHref}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-lumia-dark">
              {tFooter("quickLinksTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-lumia-dark">
              {tFooter("servicesTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tServices(`${link.labelKey}.name`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-lumia-dark">
              {tFooter("contactTitle")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{site.address.full}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={phoneHref} className="hover:text-foreground">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={emailHref} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name}. {tFooter("rights")}
          </span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  )
}
