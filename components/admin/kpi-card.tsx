import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import type { TrendMetric } from "@/lib/dashboard-metrics"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface KpiCardProps {
  icon?: LucideIcon
  title: string
  value: string
  metric: TrendMetric
  suffix?: string
  invertTrend?: boolean
}

export function KpiCard({ icon: Icon, title, value, metric, suffix, invertTrend }: KpiCardProps) {
  const trend = metric.trendPercent
  const isPositive = trend !== null && trend >= 0
  const isGood = invertTrend ? !isPositive : isPositive

  return (
    <Card className="border-border/60 bg-white shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lumia-dark/5">
              <Icon className="h-4 w-4 text-lumia-dark" strokeWidth={1.75} />
            </div>
          )}
          <p className="text-xs font-semibold text-lumia-coffee">{title}</p>
        </div>
        <p className="mt-2 font-heading text-2xl font-bold text-lumia-dark">
          {metric.isEmpty ? "—" : value}
          {suffix && !metric.isEmpty && (
            <span className="ml-0.5 text-base font-semibold">{suffix}</span>
          )}
        </p>
        {metric.isEmpty ? (
          <p className="mt-2 text-xs text-muted-foreground">{metric.emptyHint}</p>
        ) : trend !== null ? (
          <div
            className={cn(
              "mt-2 flex items-center gap-1 text-xs font-semibold",
              isGood ? "text-emerald-600" : "text-red-600"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(trend).toFixed(1)}% geçen aya göre
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
