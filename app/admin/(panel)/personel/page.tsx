import { AdminPageHeader } from "@/components/admin/admin-shell"
import { StaffEditor } from "@/components/admin/staff-editor"
import { getStaffMembers } from "@/lib/admin-staff-store"

export const dynamic = "force-dynamic"

export default function PersonelPage() {
  const staff = getStaffMembers()

  return (
    <>
      <AdminPageHeader title="Personel / Uzmanlar" subtitle="Ekip üyelerini düzenleyin ve yönetin" />
      <main className="p-4 sm:p-6">
        <StaffEditor initialStaff={staff} />
      </main>
    </>
  )
}
