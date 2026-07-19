"use client"

import { useLocale } from "next-intl"
import { Globe } from "lucide-react"

import { locales, localeNames } from "@/i18n/routing"
import { usePathname, useRouter } from "@/i18n/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ scrolled = true }: { scrolled?: boolean }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2",
            !scrolled && "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={loc === locale ? "font-semibold" : ""}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
