"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"

import { Phone } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/i18n/navigation"
import { phoneHref } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/public/language-switcher"
import { MobileNav } from "@/components/public/mobile-nav"
import { publicNavLinks } from "@/lib/public-nav"

const links = publicNavLinks

export function Header() {
  const t = useTranslations("Nav")
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === "/"

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHome])

  // Only the home page has a full-bleed dark hero behind the header at scroll 0.
  const onDarkHero = isHome && !scrolled
  const isOpaque = !onDarkHero

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 sm:px-4",
          isOpaque
            ? "border-white/50 bg-white/80 shadow-soft-lg"
            : "border-white/25 bg-white/15 shadow-soft"
        )}
      >
        <Link
          href="/"
          className={cn(
            "font-heading text-xl font-bold tracking-tight transition-colors",
            isOpaque ? "text-lumia-dark" : "text-white"
          )}
        >
          Lumia
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? isOpaque
                      ? "text-lumia-dark"
                      : "text-white"
                    : isOpaque
                      ? "text-lumia-dark/65 hover:text-lumia-dark"
                      : "text-white/80 hover:text-white"
                )}
              >
                {t(link.key)}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full",
                      isOpaque ? "bg-lumia-dark" : "bg-white"
                    )}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full",
              !isOpaque && "text-white hover:bg-white/15 hover:text-white"
            )}
          >
            <a href={phoneHref} aria-label="Ara">
              <Phone className="h-4 w-4" />
            </a>
          </Button>
          <div className="hidden sm:block">
            <LanguageSwitcher scrolled={isOpaque} />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/randevu">{t("book")}</Link>
          </Button>
          <MobileNav scrolled={isOpaque} />
        </div>
      </div>
    </header>
  )
}
