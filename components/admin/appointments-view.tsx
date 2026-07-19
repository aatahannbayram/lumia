"use client"

import { useMemo, useState } from "react"
import { Calendar, List } from "lucide-react"

import { MonthlyCalendar } from "@/components/admin/monthly-calendar"
import { useAdminShell } from "@/components/admin/admin-shell"
import { statusColors, statusLabels } from "@/lib/admin-nav"
import { formatPrice } from "@/lib/format"
import type { Appointment, AppointmentStatus } from "@/types/appointment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppointmentsViewProps {
  appointments: Appointment[]
  onRefresh?: () => void
  onNewAppointment?: (date?: string, time?: string) => void
}

const ALL_STATUSES: AppointmentStatus[] = [
  "new",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]

export function AppointmentsView({
  appointments,
  onRefresh,
  onNewAppointment,
}: AppointmentsViewProps) {
  const { staffMembers } = useAdminShell()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selected, setSelected] = useState<Appointment | null>(null)

  const filtered = useMemo(() => {
    return [...appointments]
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
  }, [appointments, statusFilter])

  async function updateStatus(id: string, status: AppointmentStatus) {
    await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    onRefresh?.()
    setSelected(null)
  }

  function staffName(staffId?: string) {
    return staffMembers.find((s) => s.id === staffId)?.name ?? "—"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-border/60 bg-white">
            <SelectValue placeholder="Durum filtresi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm durumlar</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList className="bg-white">
          <TabsTrigger value="calendar">
            <Calendar className="mr-1.5 h-4 w-4" />
            Aylık Takvim
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-1.5 h-4 w-4" />
            Liste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <MonthlyCalendar
            appointments={filtered}
            onSelectAppointment={setSelected}
            onNewAppointment={(date) => onNewAppointment?.(date, "09:00")}
          />
        </TabsContent>

        <TabsContent value="list">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Bu filtreye uygun randevu yok.
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white shadow-soft">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase text-lumia-coffee">
                  <tr>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3">Müşteri</th>
                    <th className="px-4 py-3 hidden md:table-cell">Hizmetler</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Personel</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="cursor-pointer border-b border-border/40 hover:bg-muted/20"
                      onClick={() => setSelected(a)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-lumia-dark">{a.date}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-lumia-dark">{a.customerName}</p>
                        <p className="text-xs text-muted-foreground">{a.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell max-w-xs truncate">
                        {a.services.map((s) => s.name).join(", ")}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">{staffName(a.staffId)}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[a.status]}>{statusLabels[a.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-lumia-dark">
                        {formatPrice(a.totalPriceMinor, "tr")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-white shadow-soft-lg">
            <div className="flex h-full flex-col p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-lumia-dark">
                    📋 {selected.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selected.date} · {selected.time}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  Kapat
                </Button>
              </div>

              <div className="mt-6 flex-1 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase text-lumia-coffee">İletişim</p>
                  <p className="text-lumia-dark">{selected.customerPhone}</p>
                  {selected.customerEmail && <p>{selected.customerEmail}</p>}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-lumia-coffee">Hizmetler</p>
                  <p>{selected.services.map((s) => s.name).join(", ")}</p>
                  <p className="text-muted-foreground">
                    {selected.totalDurationMinutes} dk · {formatPrice(selected.totalPriceMinor, "tr")}
                  </p>
                </div>
                {selected.note && (
                  <div>
                    <p className="text-xs font-bold uppercase text-lumia-coffee">Not</p>
                    <p>{selected.note}</p>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-lumia-coffee">Durum güncelle</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={selected.status === s ? "dark" : "outline"}
                        onClick={() => updateStatus(selected.id, s)}
                      >
                        {statusLabels[s]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
