import { AdminPageHeader } from "@/components/admin/admin-shell"
import { CustomersView } from "@/components/admin/customers-view"
import { deriveCustomersFromAppointments } from "@/lib/dashboard-metrics"
import { getAppointments } from "@/lib/appointments-store"

export const dynamic = "force-dynamic"

export default function MusterilerPage() {
  const appointments = getAppointments()
  const customers = deriveCustomersFromAppointments(appointments)

  return (
    <>
      <AdminPageHeader
        title="Müşteriler"
        subtitle="👥 CRM — arayın, detay görün, iletişime geçin"
      />
      <main className="p-4 sm:p-6">
        <CustomersView appointments={appointments} customers={customers} />
      </main>
    </>
  )
}
