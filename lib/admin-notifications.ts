import type { Appointment } from "@/types/appointment"

export interface AdminNotification {
  id: string
  title: string
  subtitle: string
  href: string
  createdAt: string
}

export function buildAdminNotifications(appointments: Appointment[]): AdminNotification[] {
  return appointments
    .filter((a) => a.status === "new")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 12)
    .map((a) => ({
      id: a.id,
      title: `Yeni randevu — ${a.customerName}`,
      subtitle: `${a.date} ${a.time} · ${a.services.map((s) => s.name).join(", ")}`,
      href: "/admin/randevular",
      createdAt: a.createdAt,
    }))
}
