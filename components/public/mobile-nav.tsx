"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Menu, Phone } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { phoneHref } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/public/language-switcher"
import { publicNavLinks } from "@/lib/public-nav"
import { cn } from "@/lib/utils"

const links = publicNavLinks

export function MobileNav({ scrolled = true }: { scrolled?: boolean }) {
  const t = useTranslations("Nav")
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("lg:hidden", !scrolled && "text-white hover:bg-white/15 hover:text-white")}
          aria-label={t("menu")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="text-2xl">Lumia</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 pb-4">
          <Button asChild variant="outline" size="lg" onClick={() => setOpen(false)}>
            <a href={phoneHref}>
              <Phone className="h-4 w-4" />
              {t("call")}
            </a>
          </Button>
          <LanguageSwitcher />
          <Button asChild size="lg" onClick={() => setOpen(false)}>
            <Link href="/randevu">{t("book")}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
