import { AdminPageHeader } from "@/components/admin/admin-shell"
import { AdminPlaceholder } from "@/components/admin/admin-placeholder"

export default function YorumlarPage() {
  return (
    <>
      <AdminPageHeader title="Yorumlar" subtitle="Müşteri yorumlarını onaylayın veya gizleyin" />
      <main className="p-4 sm:p-6">
        <AdminPlaceholder
          title="Yorum moderasyonu"
          description="Müşteri yorumları Nhost entegrasyonu ile burada yönetilecek. Şimdilik vitrin yorumları statik seed verisinden geliyor."
        />
      </main>
    </>
  )
}
