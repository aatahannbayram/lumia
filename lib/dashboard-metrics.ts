import {
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns"
import { tr } from "date-fns/locale"

import type { Appointment } from "@/types/appointment"

export interface TrendMetric {
  value: number
  previousValue: number
  trendPercent: number | null
  isEmpty: boolean
  emptyHint?: string
}

export interface ChartPoint {
  label: string
  revenue: number
  appointments: number
}

export interface TopCustomer {
  id: string
  name: string
  phone: string
  email?: string
  appointmentCount: number
  totalSpentMinor: number
  lastVisit: string
}

export interface CustomerInsights {
  newThisWeek: number
  vipCount: number
  totalCount: number
}

export interface ActiveCampaign {
  id: string
  name: string
  type: string
  status: "active" | "running" | "draft"
}

export interface DashboardMetrics {
  revenue: TrendMetric
  appointmentCount: TrendMetric
  averageTicket: TrendMetric
  returningRate: TrendMetric
  noShowRate: TrendMetric
  newRequests: TrendMetric
  chartData: ChartPoint[]
  customerInsights: CustomerInsights
  topCustomers: TopCustomer[]
  retention: TrendMetric
  activeCampaigns: ActiveCampaign[]
  pendingCount: number
}

function revenueFrom(appointments: Appointment[]) {
  return appointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + a.totalPriceMinor, 0)
}

function trend(current: number, previous: number): TrendMetric {
  if (current === 0 && previous === 0) {
    return {
      value: 0,
      previousValue: 0,
      trendPercent: null,
      isEmpty: true,
      emptyHint: "Veri birikince dolacak",
    }
  }
  const trendPercent =
    previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100
  return {
    value: current,
    previousValue: previous,
    trendPercent,
    isEmpty: false,
  }
}

function monthRange(offsetMonths: number) {
  const anchor = subMonths(new Date(), offsetMonths)
  return { start: startOfMonth(anchor), end: endOfMonth(anchor) }
}

function inRange(a: Appointment, start: Date, end: Date) {
  const d = new Date(`${a.date}T12:00:00`)
  return isWithinInterval(d, { start, end })
}

function customerKey(a: Appointment) {
  return a.customerPhone.replace(/\D/g, "")
}

function buildCustomers(appointments: Appointment[]): TopCustomer[] {
  const map = new Map<string, TopCustomer>()

  for (const a of appointments) {
    if (a.status === "cancelled") continue
    const key = customerKey(a)
    const existing = map.get(key)
    if (existing) {
      existing.appointmentCount += 1
      existing.totalSpentMinor += a.totalPriceMinor
      if (a.date > existing.lastVisit) {
        existing.lastVisit = a.date
        existing.name = a.customerName
        existing.email = a.customerEmail ?? existing.email
      }
    } else {
      map.set(key, {
        id: key,
        name: a.customerName,
        phone: a.customerPhone,
        email: a.customerEmail,
        appointmentCount: 1,
        totalSpentMinor: a.totalPriceMinor,
        lastVisit: a.date,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpentMinor - a.totalSpentMinor)
}

export function computeDashboardMetrics(appointments: Appointment[]): DashboardMetrics {
  const now = new Date()
  const thisMonth = monthRange(0)
  const lastMonth = monthRange(1)

  const thisMonthAppts = appointments.filter((a) => inRange(a, thisMonth.start, thisMonth.end))
  const lastMonthAppts = appointments.filter((a) => inRange(a, lastMonth.start, lastMonth.end))

  const completedThis = thisMonthAppts.filter(
    (a) => a.status === "completed" || a.status === "confirmed"
  )
  const completedLast = lastMonthAppts.filter(
    (a) => a.status === "completed" || a.status === "confirmed"
  )

  const revenueThis = revenueFrom(completedThis)
  const revenueLast = revenueFrom(completedLast)

  const countThis = thisMonthAppts.filter((a) => a.status !== "cancelled").length
  const countLast = lastMonthAppts.filter((a) => a.status !== "cancelled").length

  const avgThis = countThis > 0 ? revenueThis / countThis : 0
  const avgLast = countLast > 0 ? revenueLast / countLast : 0

  const customers = buildCustomers(appointments)
  const returning = customers.filter((c) => c.appointmentCount > 1).length
  const returningRate = customers.length > 0 ? (returning / customers.length) * 100 : 0

  const lastMonthCustomers = buildCustomers(lastMonthAppts)
  const returningLast =
    lastMonthCustomers.length > 0
      ? (lastMonthCustomers.filter((c) => c.appointmentCount > 1).length /
          lastMonthCustomers.length) *
        100
      : 0

  const noShowsThis = thisMonthAppts.filter((a) => a.status === "no_show").length
  const noShowDenom = thisMonthAppts.filter(
    (a) => a.status === "completed" || a.status === "confirmed" || a.status === "no_show"
  ).length
  const noShowRate = noShowDenom > 0 ? (noShowsThis / noShowDenom) * 100 : 0

  const noShowsLast = lastMonthAppts.filter((a) => a.status === "no_show").length
  const noShowDenomLast = lastMonthAppts.filter(
    (a) => a.status === "completed" || a.status === "confirmed" || a.status === "no_show"
  ).length
  const noShowRateLast = noShowDenomLast > 0 ? (noShowsLast / noShowDenomLast) * 100 : 0

  const newRequestsThis = thisMonthAppts.filter((a) => a.status === "new").length
  const newRequestsLast = lastMonthAppts.filter((a) => a.status === "new").length

  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const newThisWeek = customers.filter((c) => new Date(c.lastVisit) >= weekAgo).length
  const vipCount = customers.filter(
    (c) => c.appointmentCount >= 3 || c.totalSpentMinor >= 300000
  ).length

  const chartData: ChartPoint[] = Array.from({ length: 6 }, (_, i) => {
    const range = monthRange(5 - i)
    const monthAppts = appointments.filter((a) => inRange(a, range.start, range.end))
    const completed = monthAppts.filter(
      (a) => a.status === "completed" || a.status === "confirmed"
    )
    return {
      label: format(range.start, "MMM", { locale: tr }),
      revenue: revenueFrom(completed) / 100,
      appointments: monthAppts.filter((a) => a.status !== "cancelled").length,
    }
  })

  const pendingCount = appointments.filter((a) => a.status === "new").length

  return {
    revenue: trend(revenueThis / 100, revenueLast / 100),
    appointmentCount: trend(countThis, countLast),
    averageTicket: trend(avgThis / 100, avgLast / 100),
    returningRate: trend(returningRate, returningLast),
    noShowRate: trend(noShowRate, noShowRateLast),
    newRequests: trend(newRequestsThis, newRequestsLast),
    chartData,
    customerInsights: {
      newThisWeek,
      vipCount,
      totalCount: customers.length,
    },
    topCustomers: customers.slice(0, 5),
    retention: trend(returningRate, returningLast),
    activeCampaigns: [
      {
        id: "opening-10",
        name: "Açılış %10 İndirim",
        type: "Kupon",
        status: "active",
      },
      {
        id: "whatsapp-reminder",
        name: "WhatsApp Hatırlatma",
        type: "Otomasyon",
        status: "running",
      },
    ],
    pendingCount,
  }
}

export { buildCustomers as deriveCustomersFromAppointments }
