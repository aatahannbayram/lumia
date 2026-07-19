"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ChartPoint } from "@/lib/dashboard-metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RevenueChartProps {
  data: ChartPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [view, setView] = useState<"monthly" | "weekly" | "daily">("monthly")
  const isEmpty = data.every((d) => d.revenue === 0 && d.appointments === 0)

  return (
    <Card className="h-fit border-border/50">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 px-4 pb-2 pt-4 sm:px-5">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">Ciro & Randevu Analitiği</CardTitle>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Tamamlanan randevulardan hesaplanır
          </p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList className="h-7 shrink-0">
            <TabsTrigger value="daily" className="px-2 text-[11px]">
              Günlük
            </TabsTrigger>
            <TabsTrigger value="weekly" className="px-2 text-[11px]">
              Haftalık
            </TabsTrigger>
            <TabsTrigger value="monthly" className="px-2 text-[11px]">
              Aylık
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-44 px-4 pb-4 pt-0 sm:h-48 sm:px-5">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            Grafik verisi birikince burada görünecek
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="lumiaBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8B5AE" />
                  <stop offset="100%" stopColor="#F7F6F4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                height={24}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={40}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₺${v}`}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "revenue"
                    ? [`₺${Number(value).toLocaleString("tr-TR")}`, "Ciro"]
                    : [Number(value), "Randevu"]
                }
              />
              <Bar dataKey="revenue" fill="url(#lumiaBar)" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
