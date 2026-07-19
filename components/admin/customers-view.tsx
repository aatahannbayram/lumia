"use client"

import { useMemo, useState } from "react"
import { Mail, MessageCircle, Phone, Search, X } from "lucide-react"

import {
  buildCustomerDetails,
  customerEmailUrl,
  customerPhoneUrl,
  customerWhatsAppUrl,
} from "@/lib/admin-crm"
import type { TopCustomer } from "@/lib/dashboard-metrics"
import { formatPrice } from "@/lib/format"
import type { Appointment } from "@/types/appointment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { statusLabels } from "@/lib/admin-nav"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

interface CustomersViewProps {
  appointments: Appointment[]
  customers: TopCustomer[]
}

export function CustomersView({ appointments, customers }: CustomersViewProps) {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const details = useMemo(
    () => buildCustomerDetails(appointments, customers),
    [appointments, customers]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return details
    return details.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email?.toLowerCase().includes(q)
    )
  }, [details, query])

  const selected = details.find((c) => c.id === selectedId) ?? null

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="İsim, telefon veya e-posta ara…"
          className="rounded-full border-border/60 bg-white pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {query ? "Aramanızla eşleşen müşteri bulunamadı." : "Henüz müşteri kaydı yok."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className="rounded-2xl border border-border/60 bg-white p-4 text-left shadow-soft transition-all hover:border-lumia-coffee/40 hover:shadow-soft-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-lumia-taupe/40 text-sm font-bold">
                    {initials(c.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading font-semibold text-lumia-dark">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.phone}</p>
                </div>
                <span className="text-lg">{c.loyaltyEmoji}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{c.appointmentCount} randevu</span>
                <span className="font-bold text-lumia-dark">
                  {formatPrice(c.totalSpentMinor, "tr")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedId(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-white shadow-soft-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selected.loyaltyEmoji}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-lumia-dark">{selected.name}</h3>
                  <Badge variant="secondary">{selected.loyaltyLabel}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-lumia-coffee">
                  📞 İletişime Geç
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="dark" size="sm" asChild>
                    <a
                      href={customerWhatsAppUrl(selected.phone, selected.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={customerPhoneUrl(selected.phone)}>
                      <Phone className="h-4 w-4" />
                      Ara
                    </a>
                  </Button>
                  {selected.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={customerEmailUrl(selected.email, selected.name)}>
                        <Mail className="h-4 w-4" />
                        E-posta
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Toplam Harcama", value: formatPrice(selected.totalSpentMinor, "tr"), emoji: "💰" },
                  { label: "Randevu Sayısı", value: String(selected.appointmentCount), emoji: "📅" },
                  { label: "Son Ziyaret", value: selected.lastVisit, emoji: "🕐" },
                  {
                    label: "Ortalama",
                    value: formatPrice(
                      Math.round(selected.totalSpentMinor / selected.appointmentCount),
                      "tr"
                    ),
                    emoji: "📊",
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-muted/50 p-3">
                    <p className="text-lg">{item.emoji}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-heading font-bold text-lumia-dark">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-lumia-coffee">
                  📋 Randevu Geçmişi
                </p>
                <div className="space-y-2">
                  {selected.appointments.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl border border-border/50 bg-muted/20 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {a.date} · {a.time}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {statusLabels[a.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {a.services.map((s) => s.name).join(", ")}
                      </p>
                      <p className="mt-1 font-semibold">{formatPrice(a.totalPriceMinor, "tr")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
