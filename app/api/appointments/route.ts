import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { createAppointment, getAppointmentsByDate } from "@/lib/appointments-store"
import { getAvailableSlots } from "@/lib/availability"
import { sendMail } from "@/lib/mailer"
import { appointmentBusinessEmail, appointmentCustomerEmail } from "@/lib/email-templates"
import { site } from "@/lib/site-config"

const bodySchema = z.object({
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
  locale: z.string(),
})

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = bodySchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const { date, time, services, customerEmail } = parsed.data
  const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0)

  // Re-validate against the current state to close the race window between
  // the client fetching availability and submitting the booking.
  const existing = getAppointmentsByDate(date)
  const stillAvailable = getAvailableSlots(existing, totalDuration).includes(time)

  if (!stillAvailable) {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 })
  }

  const appointment = createAppointment({
    ...parsed.data,
    customerEmail: customerEmail || undefined,
  })

  // WhatsApp otomasyon — best-effort, yanıtı bloklamaz
  import("@/lib/whatsapp-automation").then(async ({ getWhatsAppAutomations, runAutomationForAppointment }) => {
    const welcome = getWhatsAppAutomations().find(
      (a) => a.enabled && a.trigger === "appointment_created"
    )
    if (welcome) {
      runAutomationForAppointment(welcome, appointment).catch((err) =>
        console.error("[whatsapp] welcome failed", err)
      )
    }
  }).catch(() => {})

  // Best-effort notification emails — never block the booking response on these.
  const businessEmail = appointmentBusinessEmail(appointment.locale, appointment)
  sendMail({ to: site.email, ...businessEmail }).catch((err) =>
    console.error("[appointments] business email failed", err)
  )

  if (appointment.customerEmail) {
    const customerEmailContent = appointmentCustomerEmail(appointment.locale, appointment)
    sendMail({ to: appointment.customerEmail, ...customerEmailContent }).catch((err) =>
      console.error("[appointments] customer email failed", err)
    )
  }

  return NextResponse.json({ appointment }, { status: 201 })
}
