import { DashboardClient } from "@/components/admin/dashboard-client"
import { computeGaStats } from "@/lib/admin-crm"
import { getNewsItems } from "@/lib/admin-news-store"
import { getAppointments } from "@/lib/appointments-store"
import { computeDashboardMetrics } from "@/lib/dashboard-metrics"

export const dynamic = "force-dynamic"

export default function AdminDashboardPage() {
  const appointments = getAppointments()
  const metrics = computeDashboardMetrics(appointments)
  const gaStats = computeGaStats(appointments)
  const news = getNewsItems()

  return <DashboardClient metrics={metrics} gaStats={gaStats} news={news} />
}
