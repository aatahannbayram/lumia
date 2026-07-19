import Link from "next/link"
import { Sparkles, TrendingUp } from "lucide-react"

import type { DashboardMetrics } from "@/lib/dashboard-metrics"
import { formatPrice } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardPanelsProps {
  metrics: DashboardMetrics
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function DashboardPanels({ metrics }: DashboardPanelsProps) {
  const { customerInsights, topCustomers, retention, activeCampaigns } = metrics

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">👥 Müşteri İçgörüleri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          {[
            { label: "Yeni (hafta)", value: customerInsights.newThisWeek, icon: "🌱" },
            { label: "VIP", value: customerInsights.vipCount, icon: "👑" },
            { label: "Toplam", value: customerInsights.totalCount, icon: "👥" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-muted/60 p-3 text-center">
              <p className="text-lg">{item.icon}</p>
              <p className="mt-2 font-heading text-lg font-bold">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">En İyi Müşteriler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topCustomers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz müşteri verisi yok.</p>
          ) : (
            topCustomers.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-lumia-taupe/30 text-xs">
                    {initials(c.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.appointmentCount} randevu
                  </p>
                </div>
                <p className="text-sm font-semibold text-lumia-dark">
                  {formatPrice(c.totalSpentMinor, "tr")}
                </p>
              </div>
            ))
          )}
          <Link href="/admin/musteriler" className="text-xs font-medium text-lumia-coffee hover:underline">
            Tüm müşteriler →
          </Link>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Müşteri Sadakati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <p className="font-heading text-3xl font-bold">
              {retention.isEmpty ? "—" : `${retention.value.toFixed(0)}%`}
            </p>
            {retention.trendPercent !== null && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                {retention.trendPercent >= 0 ? "+" : ""}
                {retention.trendPercent.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lumia-gold to-lumia-coffee"
              style={{ width: `${Math.min(retention.value, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Tekrarlayan müşteri oranı</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Aktif Kampanyalar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeCampaigns.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-lumia-gold" />
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.type}</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={
                  c.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {c.status === "active" ? "Aktif" : "Çalışıyor"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
