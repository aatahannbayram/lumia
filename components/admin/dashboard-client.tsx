"use client"

import dynamic from "next/dynamic"

import { AnalyticsPanel } from "@/components/admin/analytics-panel"
import { AdminPageHeader } from "@/components/admin/admin-shell"
import { DashboardPanels } from "@/components/admin/dashboard-panels"
import { KpiCard } from "@/components/admin/kpi-card"
import { NewsPanel } from "@/components/admin/news-panel"
import { QuickActionCards } from "@/components/admin/quick-actions"
import type { GaStats } from "@/lib/admin-crm"
import type { AdminNewsItem } from "@/lib/admin-news-store"
import type { DashboardMetrics } from "@/lib/dashboard-metrics"
import { kpiIcons } from "@/lib/admin-nav"
import { formatPrice } from "@/lib/format"

const RevenueChart = dynamic(
  () => import("@/components/admin/revenue-chart").then((m) => m.RevenueChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-white text-sm text-muted-foreground">
        Grafik yükleniyor…
      </div>
    ),
  }
)

interface DashboardClientProps {
  metrics: DashboardMetrics
  gaStats: GaStats
  news: AdminNewsItem[]
}

export function DashboardClient({ metrics, gaStats, news }: DashboardClientProps) {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Hoş geldiniz! İşletmenizin bugünkü özeti."
      />

      <main className="space-y-5 p-4 sm:p-6">
        <QuickActionCards />

        <AnalyticsPanel stats={gaStats} compact />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            icon={kpiIcons.revenue}
            title="Toplam Ciro (bu ay)"
            value={formatPrice(Math.round(metrics.revenue.value * 100), "tr")}
            metric={metrics.revenue}
          />
          <KpiCard
            icon={kpiIcons.appointments}
            title="Randevu Sayısı (bu ay)"
            value={String(Math.round(metrics.appointmentCount.value))}
            metric={metrics.appointmentCount}
          />
          <KpiCard
            icon={kpiIcons.average}
            title="Ortalama Randevu Bedeli"
            value={formatPrice(Math.round(metrics.averageTicket.value * 100), "tr")}
            metric={metrics.averageTicket}
          />
          <KpiCard
            icon={kpiIcons.returning}
            title="Geri Dönen Müşteri"
            value={metrics.returningRate.isEmpty ? "—" : metrics.returningRate.value.toFixed(0)}
            suffix="%"
            metric={metrics.returningRate}
          />
          <KpiCard
            icon={kpiIcons.noshow}
            title="İptal / Gelmedi Oranı"
            value={metrics.noShowRate.isEmpty ? "—" : metrics.noShowRate.value.toFixed(1)}
            suffix="%"
            metric={metrics.noShowRate}
            invertTrend
          />
          <KpiCard
            icon={kpiIcons.newRequests}
            title="Yeni Randevu Talepleri"
            value={String(Math.round(metrics.newRequests.value))}
            metric={metrics.newRequests}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_300px]">
          <RevenueChart data={metrics.chartData} />
          <DashboardPanels metrics={metrics} />
        </div>

        <NewsPanel items={news} />
      </main>
    </>
  )
}
