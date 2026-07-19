import "server-only"
import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"

import type { Appointment } from "@/types/appointment"

const DATA_DIR = path.join(process.cwd(), "data")
const AUTOMATIONS_FILE = path.join(DATA_DIR, "whatsapp-automations.json")
const LOG_FILE = path.join(DATA_DIR, "whatsapp-log.json")

export type AutomationTrigger =
  | "appointment_created"
  | "appointment_reminder_24h"
  | "appointment_completed"
  | "manual"

export interface WhatsAppAutomation {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: AutomationTrigger
  template: string
}

export interface WhatsAppLogEntry {
  id: string
  automationId: string
  phone: string
  customerName: string
  message: string
  sentAt: string
  status: "sent" | "simulated" | "failed"
  error?: string
}

const DEFAULT_AUTOMATIONS: WhatsAppAutomation[] = [
  {
    id: "welcome",
    name: "Randevu Onayı",
    description: "Yeni randevu oluşturulunca müşteriye onay mesajı gönderir.",
    enabled: true,
    trigger: "appointment_created",
    template:
      "Merhaba {{name}}! Lumia Beauty randevunuz alındı.\n{{date}} · {{time}}\n{{services}}\nAdres: Bomonti, Şişli\nSorularınız için bu mesaja yanıt verebilirsiniz.",
  },
  {
    id: "reminder-24h",
    name: "24 Saat Hatırlatma",
    description: "Randevudan 24 saat önce otomatik hatırlatma gönderir.",
    enabled: true,
    trigger: "appointment_reminder_24h",
    template:
      "Merhaba {{name}}, yarınki randevunuzu hatırlatmak isteriz.\n{{date}} · {{time}}\n{{services}}\nGelemeyecekseniz lütfen bizi bilgilendirin.",
  },
  {
    id: "thank-you",
    name: "Teşekkür Mesajı",
    description: "Tamamlanan randevu sonrası teşekkür ve geri bildirim ister.",
    enabled: false,
    trigger: "appointment_completed",
    template:
      "Merhaba {{name}}! Lumia'yı tercih ettiğiniz için teşekkürler.\nDeneyiminizi değerlendirmek ister misiniz? Bir sonraki randevunuzda %10 indirim için ACILIS10 kodunu kullanabilirsiniz.",
  },
  {
    id: "campaign",
    name: "Kampanya Duyurusu",
    description: "Manuel olarak seçili müşterilere kampanya mesajı gönderir.",
    enabled: true,
    trigger: "manual",
    template:
      "Merhaba {{name}}! Lumia Beauty'den özel teklif:\nYaz bakım paketlerinde %15 indirim — sadece bu hafta.\nRandevu: lumiaclub.com/tr/randevu",
  },
]

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readAutomations(): WhatsAppAutomation[] {
  ensureDir()
  if (!fs.existsSync(AUTOMATIONS_FILE)) {
    fs.writeFileSync(AUTOMATIONS_FILE, JSON.stringify(DEFAULT_AUTOMATIONS, null, 2), "utf-8")
  }
  try {
    return JSON.parse(fs.readFileSync(AUTOMATIONS_FILE, "utf-8")) as WhatsAppAutomation[]
  } catch {
    return DEFAULT_AUTOMATIONS
  }
}

function readLog(): WhatsAppLogEntry[] {
  ensureDir()
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, "[]", "utf-8")
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")) as WhatsAppLogEntry[]
  } catch {
    return []
  }
}

export function getWhatsAppAutomations() {
  return readAutomations()
}

export function getWhatsAppLog(limit = 20) {
  return readLog()
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
    .slice(0, limit)
}

export function updateWhatsAppAutomation(id: string, patch: Partial<WhatsAppAutomation>) {
  const automations = readAutomations()
  const index = automations.findIndex((a) => a.id === id)
  if (index === -1) return null
  automations[index] = { ...automations[index], ...patch }
  fs.writeFileSync(AUTOMATIONS_FILE, JSON.stringify(automations, null, 2), "utf-8")
  return automations[index]
}

export function renderTemplate(template: string, appointment: Appointment) {
  return template
    .replace(/\{\{name\}\}/g, appointment.customerName)
    .replace(/\{\{date\}\}/g, appointment.date)
    .replace(/\{\{time\}\}/g, appointment.time)
    .replace(/\{\{services\}\}/g, appointment.services.map((s) => s.name).join(", "))
    .replace(/\{\{phone\}\}/g, appointment.customerPhone)
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`
}

export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<{ status: "sent" | "simulated" | "failed"; error?: string }> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneId) {
    return { status: "simulated" }
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizePhone(phone),
        type: "text",
        text: { body: message },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { status: "failed", error: err }
    }
    return { status: "sent" }
  } catch (e) {
    return { status: "failed", error: String(e) }
  }
}

function appendLog(entry: Omit<WhatsAppLogEntry, "id" | "sentAt">) {
  const log = readLog()
  log.push({
    ...entry,
    id: randomUUID(),
    sentAt: new Date().toISOString(),
  })
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), "utf-8")
}

export async function runAutomationForAppointment(
  automation: WhatsAppAutomation,
  appointment: Appointment
) {
  const message = renderTemplate(automation.template, appointment)
  const result = await sendWhatsAppMessage(appointment.customerPhone, message)

  appendLog({
    automationId: automation.id,
    phone: appointment.customerPhone,
    customerName: appointment.customerName,
    message,
    status: result.status,
    error: result.error,
  })

  return result
}

export async function processAutomations(appointments: Appointment[]) {
  const automations = readAutomations().filter((a) => a.enabled)
  const now = new Date()
  const results: { automation: string; customer: string; status: string }[] = []

  for (const automation of automations) {
    if (automation.trigger === "appointment_reminder_24h") {
      for (const appt of appointments) {
        if (appt.status === "cancelled") continue
        const apptDate = new Date(`${appt.date}T${appt.time}:00`)
        const diff = apptDate.getTime() - now.getTime()
        const hours = diff / (1000 * 60 * 60)
        if (hours > 0 && hours <= 25) {
          const result = await runAutomationForAppointment(automation, appt)
          results.push({
            automation: automation.name,
            customer: appt.customerName,
            status: result.status,
          })
        }
      }
    }
  }

  return results
}

export function isWhatsAppConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
}

export function whatsAppWebUrl(phone: string, message: string) {
  const normalized = normalizePhone(phone)
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
