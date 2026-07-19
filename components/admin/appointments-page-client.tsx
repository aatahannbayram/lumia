"use client"

import { useRouter } from "next/navigation"

import { AppointmentsView } from "@/components/admin/appointments-view"
import { useAdminShell } from "@/components/admin/admin-shell"
import type { Appointment } from "@/types/appointment"

export function AppointmentsPageClient({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const { openNewAppointment } = useAdminShell()

  return (
    <AppointmentsView
      appointments={appointments}
      onRefresh={() => router.refresh()}
      onNewAppointment={openNewAppointment}
    />
  )
}
