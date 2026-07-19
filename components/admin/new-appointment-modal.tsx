"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import type { AdminStaffMember } from "@/lib/admin-staff-store"
import type { AdminService } from "@/lib/admin-catalog-store"
import type { AppointmentServiceLine } from "@/types/appointment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ServiceOption {
  slug: string
  name: string
  priceMinor: number
  durationMinutes: number
}

interface NewAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
  defaultDate?: string
  defaultTime?: string
  serviceNames: Record<string, string>
  staffMembers?: AdminStaffMember[]
  catalogServices?: AdminService[]
}

export function NewAppointmentModal({
  open,
  onOpenChange,
  onCreated,
  defaultDate,
  defaultTime,
  serviceNames,
  staffMembers = [],
  catalogServices = [],
}: NewAppointmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    date: defaultDate ?? new Date().toISOString().slice(0, 10),
    time: defaultTime ?? "09:00",
    note: "",
    staffId: "",
  })

  const serviceOptions: ServiceOption[] = catalogServices
    .filter((s) => s.active)
    .map((s) => ({
      slug: s.slug,
      name: s.name || serviceNames[s.slug] || s.slug,
      priceMinor: s.priceMinor,
      durationMinutes: s.durationMinutes,
    }))

  const selectedServices: AppointmentServiceLine[] = serviceOptions.filter((s) =>
    selectedSlugs.includes(s.slug)
  )
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0)

  useEffect(() => {
    if (!open) return
    setForm((f) => ({
      ...f,
      date: defaultDate ?? f.date,
      time: defaultTime ?? f.time,
    }))
  }, [open, defaultDate, defaultTime])

  useEffect(() => {
    if (!form.date || totalDuration === 0) {
      setSlots([])
      return
    }
    fetch(`/api/appointments/availability?date=${form.date}&duration=${totalDuration}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
  }, [form.date, totalDuration])

  function toggleService(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedServices.length === 0) {
      setError("En az bir hizmet seçin")
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          services: selectedServices,
          staffId: form.staffId || undefined,
          status: "confirmed",
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error === "slot_taken" ? "Bu saat dolu" : "Kayıt başarısız")
        return
      }
      onOpenChange(false)
      setSelectedSlugs([])
      setForm({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        date: new Date().toISOString().slice(0, 10),
        time: "09:00",
        note: "",
        staffId: "",
      })
      onCreated?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Randevu</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="mb-2 block">Hizmetler</Label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => toggleService(s.slug)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedSlugs.includes(s.slug)
                      ? "border-lumia-dark bg-lumia-dark text-white"
                      : "border-border bg-white hover:border-lumia-coffee"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="customerName">Müşteri Adı</Label>
              <Input
                id="customerName"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefon</Label>
              <Input
                id="customerPhone"
                required
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerEmail">E-posta (opsiyonel)</Label>
            <Input
              id="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Saat</Label>
              <Select value={form.time} onValueChange={(v) => setForm({ ...form, time: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Saat seç" />
                </SelectTrigger>
                <SelectContent>
                  {(slots.length > 0 ? slots : ["09:00", "10:00", "11:00", "14:00", "15:00"]).map(
                    (slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Personel</Label>
            <Select
              value={form.staffId || "none"}
              onValueChange={(v) => setForm({ ...form, staffId: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Personel seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Atanmadı</SelectItem>
                {staffMembers.filter((s) => s.active).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note">Not</Label>
            <Textarea
              id="note"
              rows={2}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" variant="dark" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Randevu Oluştur
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
