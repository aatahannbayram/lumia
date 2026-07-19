import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { sendMail } from "@/lib/mailer"
import { contactNotificationEmail } from "@/lib/email-templates"
import { site } from "@/lib/site-config"

const bodySchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5).max(2000),
  locale: z.string().default("tr"),
})

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = bodySchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const { name, phone, email, message, locale } = parsed.data
  const { subject, html } = contactNotificationEmail(locale, { name, phone, email, message })

  const result = await sendMail({
    to: site.email,
    subject,
    html,
    replyTo: email || undefined,
  })

  return NextResponse.json({ sent: result.sent }, { status: 200 })
}
