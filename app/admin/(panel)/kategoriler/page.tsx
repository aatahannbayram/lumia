import { AdminPageHeader } from "@/components/admin/admin-shell"
import { CategoriesEditor } from "@/components/admin/categories-editor"
import { getAdminCatalog } from "@/lib/admin-catalog-store"

export const dynamic = "force-dynamic"

export default function KategorilerPage() {
  const catalog = getAdminCatalog()
  const serviceCounts = Object.fromEntries(
    catalog.categories.map((c) => [
      c.id,
      catalog.services.filter((s) => s.category === c.id && s.active).length,
    ])
  )

  return (
    <>
      <AdminPageHeader
        title="Kategoriler"
        subtitle="Kategori adı ve ikon düzenleyin"
      />
      <main className="p-4 sm:p-6">
        <CategoriesEditor
          initialCategories={catalog.categories}
          serviceCounts={serviceCounts}
        />
      </main>
    </>
  )
}
