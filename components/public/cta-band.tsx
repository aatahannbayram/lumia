import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export function CtaBand() {
  const t = useTranslations("Home")

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="flex flex-col items-center gap-6 rounded-[1.5rem] bg-lumia-gold/20 px-8 py-14 text-center">
        <h2 className="max-w-xl font-heading text-3xl font-bold text-lumia-dark sm:text-4xl">
          {t("ctaBandTitle")}
        </h2>
        <p className="max-w-md text-muted-foreground">{t("ctaBandDescription")}</p>
        <Button asChild size="lg">
          <Link href="/randevu">{t("ctaBandButton")}</Link>
        </Button>
      </div>
    </section>
  )
}
