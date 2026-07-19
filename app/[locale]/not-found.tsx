import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const t = useTranslations("Services")

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="font-heading text-6xl font-bold text-lumia-taupe">404</span>
      <h1 className="font-heading text-2xl font-semibold text-lumia-dark">
        {t("notFoundTitle")}
      </h1>
      <p className="text-muted-foreground">{t("notFoundDescription")}</p>
      <Button asChild size="lg">
        <Link href="/">{t("backToServices")}</Link>
      </Button>
    </div>
  )
}
