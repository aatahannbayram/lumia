import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getSession } from "@/lib/auth/server-session"
import {
  createAppointment,
  getAppointmentsByDate,
  updateAppointment,
} from "@/lib/appointments-store"
import { getAvailableSlots } from "@/lib/availability"

const createSchema = z.object({
  services: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string(),
        priceMinor: z.number().int().nonnegative(),
        durationMinutes: z.number().int().positive(),
      })
    )
    .min(1),
  customerName: z.string().min(2).max(120),
  customerPhone: z.string().min(6).max(30),
  customerEmail: z.string().email().optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  note: z.string().max(500).optional(),
  coupon: z.string().max(50).optional(),
  status: z.enum(["new", "confirmed", "completed", "cancelled", "no_show"]).optional(),
  staffId: z.string().optional(),
})

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "confirmed", "completed", "cancelled", "no_show"]).optional(),
  staffId: z.string().nullable().optional(),
  note: z.string().max(500).optional(),
})

async function requireAdmin() {
  const session = await getSession()
  if (!session) return null
  return session
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const json = await request.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const { date, time, services, customerEmail, status, staffId } = parsed.data
  const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0)
  const existing = getAppointmentsByDate(date)
  const stillAvailable = getAvailableSlots(existing, totalDuration).includes(time)

  if (!stillAvailable && status !== "cancelled") {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 })
  }

  const appointment = createAppointment({
    ...parsed.data,
    customerEmail: customerEmail || undefined,
    locale: "tr",
    status: status ?? "confirmed",
    staffId,
  })

  import("@/lib/whatsapp-automation").then(async ({ getWhatsAppAutomations, runAutomationForAppointment }) => {
    const welcome = getWhatsAppAutomations().find(
      (a) => a.enabled && a.trigger === "appointment_created"
    )
    if (welcome) {
      runAutomationForAppointment(welcome, appointment).catch(console.error)
    }
  }).catch(() => {})

  return NextResponse.json({ appointment }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const json = await request.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const { id, ...updates } = parsed.data
  const updated = updateAppointment(id, updates)
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  return NextResponse.json({ appointment: updated })
}
