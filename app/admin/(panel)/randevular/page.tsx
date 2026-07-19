import { AdminPageHeader } from "@/components/admin/admin-shell"
import { AppointmentsPageClient } from "@/components/admin/appointments-page-client"
import { getAppointments } from "@/lib/appointments-store"

export default function RandevularPage() {
  const appointments = getAppointments()

  return (
    <>
      <AdminPageHeader
        title="Randevular"
        subtitle="Tüm randevuları listeleyin, takvimden yönetin veya manuel ekleyin."
      />
      <main className="p-4 sm:p-6">
        <AppointmentsPageClient appointments={appointments} />
      </main>
    </>
  )
}
