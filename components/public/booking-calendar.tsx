"use client"

import { useEffect, useMemo, useState } from "react"
import { addDays, format, isSameDay } from "date-fns"
import { ar, enUS, ru, tr } from "date-fns/locale"
import { useLocale, useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const dateLocales = { tr, en: enUS, ar, ru }

interface BookingCalendarProps {
  durationMinutes: number
  selectedDate: string | null
  selectedTime: string | null
  onSelectDate: (date: string) => void
  onSelectTime: (time: string) => void
  refreshKey?: number
}

export function BookingCalendar({
  durationMinutes,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  refreshKey = 0,
}: BookingCalendarProps) {
  const t = useTranslations("Booking")
  const locale = useLocale()
  const dateLocale = dateLocales[locale as keyof typeof dateLocales] ?? enUS

  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 21 }, (_, i) => addDays(today, i))
  }, [])

  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedDate || durationMinutes <= 0) {
      setSlots([])
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/appointments/availability?date=${selectedDate}&duration=${durationMinutes}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedDate, durationMinutes, refreshKey])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-foreground/80">
          <span aria-hidden="true">📅</span>
          {t("formDate")}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => {
            const iso = format(day, "yyyy-MM-dd")
            const isSelected = selectedDate === iso
            const isToday = isSameDay(day, new Date())
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectDate(iso)}
                className={cn(
                  "flex w-14 shrink-0 flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-colors",
                  isSelected
                    ? "border-lumia-dark bg-lumia-dark text-white"
                    : "border-border/60 bg-white text-foreground/80 hover:border-lumia-dark/40"
                )}
              >
                <span className="text-[10px] uppercase tracking-wide opacity-70">
                  {format(day, "EEE", { locale: dateLocale })}
                </span>
                <span className="font-heading text-base font-semibold">{format(day, "d")}</span>
                <span className="text-[10px] opacity-70">
                  {format(day, "MMM", { locale: dateLocale })}
                </span>
                {isToday && !isSelected && (
                  <span className="h-1 w-1 rounded-full bg-lumia-coffee" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-foreground/80">
            <span aria-hidden="true">⏰</span>
            {t("formTime")}
          </p>
          {loading ? (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("loadingSlots")}
            </div>
          ) : slots.length === 0 ? (
            <p className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              <span aria-hidden="true">🙈</span>
              {t("noSlots")}
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={cn(
                    "rounded-xl border py-2 text-sm font-medium transition-colors",
                    selectedTime === slot
                      ? "border-lumia-dark bg-lumia-dark text-white"
                      : "border-border/60 bg-white text-foreground/80 hover:border-lumia-dark/40"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
