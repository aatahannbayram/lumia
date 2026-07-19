import "server-only"
import fs from "node:fs"
import path from "node:path"

import { getAdminCategoryName, getAdminServiceName } from "@/lib/admin-i18n"
import { media } from "@/lib/data/media"
import { SERVICES } from "@/lib/data/services"
import type { Service, ServiceCategoryId } from "@/types"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "admin-catalog.json")

export interface AdminCategory {
  id: ServiceCategoryId
  label: string
  emoji: string
  icon: string
}

export interface AdminService {
  slug: string
  name: string
  description?: string
  category: ServiceCategoryId
  priceMinor: number
  durationMinutes: number
  active: boolean
  image: string
}

interface AdminCatalog {
  services: AdminService[]
  categories: AdminCategory[]
}

const defaultCategories: AdminCategory[] = [
  { id: "hair", label: getAdminCategoryName("hair"), emoji: "💇‍♀️", icon: "scissors" },
  { id: "nail", label: getAdminCategoryName("nail"), emoji: "💅", icon: "sparkles" },
]

function defaultCatalog(): AdminCatalog {
  return {
    categories: defaultCategories,
    services: SERVICES.map((s) => ({
      slug: s.slug,
      name: getAdminServiceName(s.slug),
      category: s.category,
      priceMinor: s.priceMinor,
      durationMinutes: s.durationMinutes,
      active: s.active,
      image: s.image,
    })),
  }
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultCatalog(), null, 2), "utf-8")
  }
}

let catalogCache: { mtimeMs: number; data: AdminCatalog } | null = null

function invalidateCatalogCache() {
  catalogCache = null
}

export function getAdminCatalog(): AdminCatalog {
  ensureStore()
  try {
    const mtimeMs = fs.statSync(DATA_FILE).mtimeMs
    if (catalogCache && catalogCache.mtimeMs === mtimeMs) {
      return catalogCache.data
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as AdminCatalog
    if (!parsed.services?.length) return defaultCatalog()
    parsed.categories = parsed.categories.map((c) => ({
      ...c,
      icon: c.icon ?? (c.id === "hair" ? "scissors" : c.id === "nail" ? "sparkles" : "star"),
    }))
    catalogCache = { mtimeMs, data: parsed }
    return parsed
  } catch {
    return defaultCatalog()
  }
}

export function getAdminServices(): AdminService[] {
  return getAdminCatalog().services
}

export function getAdminCategories(): AdminCategory[] {
  return getAdminCatalog().categories
}

export function saveAdminCatalog(catalog: AdminCatalog) {
  ensureStore()
  fs.writeFileSync(DATA_FILE, JSON.stringify(catalog, null, 2), "utf-8")
  invalidateCatalogCache()
}

export function updateAdminService(slug: string, patch: Partial<AdminService>) {
  const catalog = getAdminCatalog()
  const index = catalog.services.findIndex((s) => s.slug === slug)
  if (index === -1) return null
  catalog.services[index] = { ...catalog.services[index], ...patch }
  saveAdminCatalog(catalog)
  return catalog.services[index]
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

function uniqueSlug(name: string, existing: string[]) {
  const base = slugify(name) || "hizmet"
  if (!existing.includes(base)) return base
  let i = 2
  while (existing.includes(`${base}-${i}`)) i++
  return `${base}-${i}`
}

export function createAdminService(
  input: Omit<AdminService, "slug" | "image" | "active"> & {
    slug?: string
    image?: string
    active?: boolean
  }
) {
  const catalog = getAdminCatalog()
  const slugs = catalog.services.map((s) => s.slug)
  let slug: string
  if (input.slug?.trim()) {
    slug = slugify(input.slug.trim())
    if (slugs.includes(slug)) return null
  } else {
    slug = uniqueSlug(input.name, slugs)
  }

  const service: AdminService = {
    slug,
    name: input.name,
    description: input.description,
    category: input.category,
    priceMinor: input.priceMinor,
    durationMinutes: input.durationMinutes,
    active: input.active ?? true,
    image: input.image || media.heroCardHair,
  }
  catalog.services.push(service)
  saveAdminCatalog(catalog)
  return service
}

export function deleteAdminService(slug: string) {
  const catalog = getAdminCatalog()
  const next = catalog.services.filter((s) => s.slug !== slug)
  if (next.length === catalog.services.length) return false
  catalog.services = next
  saveAdminCatalog(catalog)
  return true
}

export function updateAdminCategory(id: ServiceCategoryId, patch: Partial<AdminCategory>) {
  const catalog = getAdminCatalog()
  const index = catalog.categories.findIndex((c) => c.id === id)
  if (index === -1) return null
  catalog.categories[index] = { ...catalog.categories[index], ...patch }
  saveAdminCatalog(catalog)
  return catalog.categories[index]
}

/** Public site reads from admin catalog */
export function toPublicService(s: AdminService): Service {
  const seed = SERVICES.find((x) => x.slug === s.slug)
  return {
    slug: s.slug,
    category: s.category,
    priceMinor: s.priceMinor,
    durationMinutes: s.durationMinutes,
    image: s.image || seed?.image || media.heroCardHair,
    gallery: seed?.gallery?.length ? seed.gallery : s.image ? [s.image] : [],
    active: s.active,
    catalogName: s.name,
    catalogDescription: s.description,
  }
}
