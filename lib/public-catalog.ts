import "server-only"

import {
  getAdminCatalog,
  getAdminServices,
  toPublicService,
} from "@/lib/admin-catalog-store"
import type { Service } from "@/types"

export function getPublicServices(): Service[] {
  return getAdminServices()
    .filter((s) => s.active)
    .map(toPublicService)
}

export function getPublicServiceBySlug(slug: string): Service | undefined {
  const admin = getAdminServices().find((s) => s.slug === slug && s.active)
  if (admin) return toPublicService(admin)
  return undefined
}

export function getAllPublicServiceSlugs(): string[] {
  return getAdminCatalog().services.filter((s) => s.active).map((s) => s.slug)
}
