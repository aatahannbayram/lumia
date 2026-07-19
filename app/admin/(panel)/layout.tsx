import { AdminShell } from "@/components/admin/admin-shell"
import { buildAdminNotifications } from "@/lib/admin-notifications"
import { getAdminServiceNames } from "@/lib/admin-i18n"
import { getAdminServices } from "@/lib/admin-catalog-store"
import { getStaffMembers } from "@/lib/admin-staff-store"
import { getAppointments } from "@/lib/appointments-store"

export const dynamic = "force-dynamic"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const appointments = getAppointments()
  const pendingCount = appointments.filter((a) => a.status === "new").length
  const serviceNames = getAdminServiceNames()
  const staffMembers = getStaffMembers()
  const catalogServices = getAdminServices()
  const notifications = buildAdminNotifications(appointments)

  return (
    <AdminShell
      pendingCount={pendingCount}
      notifications={notifications}
      staffMembers={staffMembers}
      catalogServices={catalogServices}
      serviceNames={serviceNames}
    >
      {children}
    </AdminShell>
  )
}
