import trMessages from "@/messages/tr.json"
import { SERVICES } from "@/lib/data/services"

type ServiceItems = Record<string, { name: string }>
type CategoryItems = Record<string, string>

const serviceItems = trMessages.ServiceItems as ServiceItems
const categoryItems = trMessages.ServiceCategories as CategoryItems

export function getAdminServiceName(slug: string) {
  return serviceItems[slug]?.name ?? slug
}

export function getAdminCategoryName(category: string) {
  return categoryItems[category] ?? category
}

export function getAdminServiceNames(): Record<string, string> {
  const names: Record<string, string> = {}
  for (const s of SERVICES) {
    names[s.slug] = getAdminServiceName(s.slug)
  }
  return names
}
