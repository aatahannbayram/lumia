import { BarChart3, Clock, Eye, MousePointerClick, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { GaStats } from "@/lib/admin-crm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface AnalyticsPanelProps {
  stats: GaStats
  compact?: boolean
}

export function AnalyticsPanel({ stats, compact = false }: AnalyticsPanelProps) {
  const items: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Eye, label: "Görüntüleme", value: stats.pageViews.toLocaleString("tr-TR") },
    { icon: MousePointerClick, label: "Oturum", value: stats.sessions.toLocaleString("tr-TR") },
    { icon: Users, label: "Kullanıcı", value: stats.users.toLocaleString("tr-TR") },
    { icon: BarChart3, label: "Hemen Çıkma", value: `%${stats.bounceRate}` },
  ]

  return (
    <Card className="border-border/60 bg-white shadow-soft">
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lumia-dark">
              <BarChart3 className="h-4 w-4 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-lumia-dark">Google Analytics</p>
              <p className="text-[10px] text-muted-foreground">
                {stats.measurementId ? `ID: ${stats.measurementId}` : "Demo veri · GA ID ekleyin"}
              </p>
            </div>
          </div>
          <Badge
            className={
              stats.connected
                ? "bg-emerald-100 text-emerald-800"
                : "bg-neutral-100 text-neutral-700"
            }
          >
            {stats.connected ? "Bağlı" : "Demo"}
          </Badge>
        </div>

        <div className={`grid grid-cols-2 gap-2 sm:grid-cols-4 ${compact ? "mt-3" : "mt-4"}`}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-lumia-dark" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-bold text-lumia-dark">
                    {item.value}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">{item.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {!compact && (
          <>
            <p className="mt-3 text-xs font-semibold text-lumia-coffee">En çok ziyaret edilen</p>
            <div className="mt-2 space-y-1">
              {stats.topPages.slice(0, 3).map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-1.5 text-xs"
                >
                  <span className="font-medium text-lumia-dark">{page.path}</span>
                  <span className="text-muted-foreground">{page.views.toLocaleString("tr-TR")}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          Ort. oturum: {stats.avgSessionDuration}
        </div>
      </CardContent>
    </Card>
  )
}
