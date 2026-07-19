import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getSession } from "@/lib/auth/server-session"
import { getAppointments } from "@/lib/appointments-store"
import {
  getWhatsAppAutomations,
  getWhatsAppLog,
  isWhatsAppConfigured,
  processAutomations,
  runAutomationForAppointment,
  updateWhatsAppAutomation,
  whatsAppWebUrl,
} from "@/lib/whatsapp-automation"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  return NextResponse.json({
    automations: getWhatsAppAutomations(),
    log: getWhatsAppLog(),
    configured: isWhatsAppConfigured(),
  })
}

const patchSchema = z.object({
  id: z.string(),
  enabled: z.boolean().optional(),
  template: z.string().optional(),
})

const sendSchema = z.object({
  phone: z.string(),
  customerName: z.string(),
  message: z.string(),
})

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const updated = updateWhatsAppAutomation(parsed.data.id, parsed.data)
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json({ automation: updated })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const action = body?.action as string

  if (action === "run") {
    const results = await processAutomations(getAppointments())
    return NextResponse.json({ results, log: getWhatsAppLog(10) })
  }

  if (action === "send") {
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 })
    }

    const { phone, customerName, message } = parsed.data
    const configured = isWhatsAppConfigured()

    if (configured) {
      const { sendWhatsAppMessage } = await import("@/lib/whatsapp-automation")
      const result = await sendWhatsAppMessage(phone, message)
      return NextResponse.json({ result, log: getWhatsAppLog(10) })
    }

    return NextResponse.json({
      result: { status: "simulated" },
      webUrl: whatsAppWebUrl(phone, message),
      customerName,
    })
  }

  if (action === "test" && body.automationId) {
    const automations = getWhatsAppAutomations()
    const automation = automations.find((a) => a.id === body.automationId)
    const appointments = getAppointments()
    const appt = appointments[0]
    if (!automation || !appt) {
      return NextResponse.json({ error: "no_data" }, { status: 400 })
    }
    const result = await runAutomationForAppointment(automation, appt)
    return NextResponse.json({ result, log: getWhatsAppLog(10) })
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 })
}
