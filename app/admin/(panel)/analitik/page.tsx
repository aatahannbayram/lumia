import { AnalyticsPanel } from "@/components/admin/analytics-panel"
import { AdminPageHeader } from "@/components/admin/admin-shell"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { NewsPanel } from "@/components/admin/news-panel"
import { computeGaStats } from "@/lib/admin-crm"
import { getNewsItems } from "@/lib/admin-news-store"
import { getAppointments } from "@/lib/appointments-store"
import { computeDashboardMetrics } from "@/lib/dashboard-metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default function AnalitikPage() {
  const appointments = getAppointments()
  const metrics = computeDashboardMetrics(appointments)
  const gaStats = computeGaStats(appointments)
  const news = getNewsItems()

  return (
    <>
      <AdminPageHeader title="Analitik" subtitle="Ciro, trafik ve salon performansı" />
      <main className="space-y-6 p-4 sm:p-6">
        <AnalyticsPanel stats={gaStats} />
        <RevenueChart data={metrics.chartData} />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "Doluluk Oranı", value: metrics.appointmentCount.value > 0 ? "~72%" : "—" },
            { title: "En Yoğun Saat", value: "14:00 – 16:00" },
            { title: "Popüler Hizmet", value: "Saç Kesim" },
          ].map((item) => (
            <Card key={item.title} className="border-border/60 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-2xl font-bold text-lumia-dark">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <NewsPanel items={news} />
      </main>
    </>
  )
}
