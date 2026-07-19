"use client"

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { tr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"

import { statusColors, statusLabels } from "@/lib/admin-nav"
import type { Appointment } from "@/types/appointment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface MonthlyCalendarProps {
  appointments: Appointment[]
  onSelectAppointment: (a: Appointment) => void
  onNewAppointment: (date: string) => void
}

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

export function MonthlyCalendar({
  appointments,
  onSelectAppointment,
  onNewAppointment,
}: MonthlyCalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  const apptsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const a of appointments) {
      const list = map.get(a.date) ?? []
      list.push(a)
      map.set(a.date, list)
    }
    return map
  }, [appointments])

  return (
    <Card className="border-border/60 bg-white shadow-soft">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, -1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="font-heading text-lg font-bold text-lumia-dark">
              {format(month, "MMMM yyyy", { locale: tr })}
            </p>
            <p className="text-xs text-muted-foreground">Aylık randevu takvimi</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-bold uppercase text-lumia-coffee"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd")
            const dayAppts = apptsByDate.get(dayStr) ?? []
            const inMonth = isSameMonth(day, month)
            const today = isSameDay(day, new Date())

            return (
              <div
                key={dayStr}
                className={`min-h-[100px] rounded-xl border p-1.5 transition-colors sm:min-h-[120px] sm:p-2 ${
                  today
                    ? "border-lumia-coffee bg-lumia-cream/80 ring-1 ring-lumia-coffee/30"
                    : inMonth
                      ? "border-border/50 bg-white hover:border-lumia-taupe/50"
                      : "border-transparent bg-muted/20 opacity-50"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold sm:text-sm ${
                      today ? "text-lumia-coffee" : inMonth ? "text-lumia-dark" : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayAppts.length > 0 && (
                    <span className="rounded-full bg-lumia-dark px-1.5 text-[10px] font-bold text-white">
                      {dayAppts.length}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  {dayAppts.slice(0, 3).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onSelectAppointment(a)}
                      className="w-full rounded-md bg-lumia-dark px-1 py-0.5 text-left text-[10px] text-white hover:bg-lumia-coffee sm:text-[11px]"
                    >
                      <span className="font-bold">{a.time}</span>{" "}
                      <span className="truncate">{a.customerName.split(" ")[0]}</span>
                    </button>
                  ))}
                  {dayAppts.length > 3 && (
                    <p className="text-center text-[10px] text-muted-foreground">
                      +{dayAppts.length - 3} daha
                    </p>
                  )}
                </div>

                {inMonth && (
                  <button
                    type="button"
                    onClick={() => onNewAppointment(dayStr)}
                    className="mt-1 w-full rounded-md border border-dashed border-lumia-taupe/60 py-0.5 text-[10px] font-medium text-lumia-coffee hover:bg-lumia-cream/50"
                  >
                    + Ekle
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-4">
          {Object.entries(statusLabels).map(([key, label]) => (
            <Badge key={key} className={`${statusColors[key]} text-[10px]`}>
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
