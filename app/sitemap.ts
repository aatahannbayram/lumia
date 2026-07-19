import type { MetadataRoute } from "next"

import { getPublishedNews } from "@/lib/admin-news-store"
import { getAllPublicServiceSlugs } from "@/lib/public-catalog"
import { site } from "@/lib/site-config"
import { locales } from "@/i18n/routing"

const staticPaths = [
  "",
  "/hizmetler",
  "/portfolyo",
  "/haberler",
  "/iletisim",
  "/randevu",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${site.domain}`
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []
  const news = getPublishedNews()

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" || path === "/haberler" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/randevu" || path === "/hizmetler" ? 0.9 : 0.7,
      })
    }

    for (const slug of getAllPublicServiceSlugs()) {
      entries.push({
        url: `${base}/${locale}/hizmet/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }

    for (const item of news) {
      entries.push({
        url: `${base}/${locale}/haberler/${item.slug}`,
        lastModified: new Date(item.date),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  }

  return entries
}
