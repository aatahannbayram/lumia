import { defineRouting } from "next-intl/routing"

export const locales = ["tr", "en", "ar", "ru"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "tr"

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
}

export const rtlLocales: Locale[] = ["ar"]

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
})
