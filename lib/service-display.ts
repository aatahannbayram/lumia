import type { Service } from "@/types"

/** Resolve service title for public UI (admin catalog name or i18n). */
export function resolveServiceName(
  service: Service,
  translate?: (key: string) => string
): string {
  if (service.catalogName) return service.catalogName
  if (translate) {
    const translated = translate(`${service.slug}.name`)
    if (translated && !translated.startsWith("ServiceItems.")) return translated
  }
  return service.slug
}

export function resolveServiceShortDescription(
  service: Service,
  translate?: (key: string) => string
): string {
  if (service.catalogDescription) return service.catalogDescription
  if (translate) {
    const translated = translate(`${service.slug}.shortDescription`)
    if (translated && !translated.startsWith("ServiceItems.")) return translated
  }
  return ""
}

export function resolveServiceDescription(
  service: Service,
  translate?: (key: string) => string
): string {
  if (service.catalogDescription) return service.catalogDescription
  if (translate) {
    const translated = translate(`${service.slug}.description`)
    if (translated && !translated.startsWith("ServiceItems.")) return translated
  }
  return ""
}
