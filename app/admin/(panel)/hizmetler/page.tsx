import { AdminPageHeader } from "@/components/admin/admin-shell"
import { ServicesEditor } from "@/components/admin/services-editor"
import { getAdminCatalog } from "@/lib/admin-catalog-store"

export const dynamic = "force-dynamic"

export default function HizmetlerPage() {
  const catalog = getAdminCatalog()

  return (
    <>
      <AdminPageHeader
        title="Hizmetler"
        subtitle="Fiyat, süre ve durumu düzenleyin"
      />
      <main className="p-4 sm:p-6">
        <ServicesEditor initialServices={catalog.services} categories={catalog.categories} />
      </main>
    </>
  )
}
