import "server-only"
import nodemailer from "nodemailer"

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD) {
    return null
  }

  if (!transporter) {
    const port = Number(EMAIL_PORT)
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port,
      secure: port === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    })
  }

  return transporter
}

interface SendMailInput {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Sends an email via the configured Hostinger SMTP account.
 * If EMAIL_PASSWORD isn't set (e.g. local dev without real credentials),
 * this silently no-ops instead of throwing so the rest of the request
 * (WhatsApp handoff, panel save) still succeeds.
 */
export async function sendMail({ to, subject, html, replyTo }: SendMailInput) {
  const client = getTransporter()
  if (!client) {
    console.warn(`[mailer] EMAIL_PASSWORD not configured — skipped email to ${to}`)
    return { sent: false as const }
  }

  await client.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    replyTo,
  })

  return { sent: true as const }
}
