import "server-only"
import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"

import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/types/appointment"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "appointments.json")

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8")
}

export function getAppointments(): Appointment[] {
  ensureStore()
  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  try {
    return JSON.parse(raw) as Appointment[]
  } catch {
    return []
  }
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return getAppointments().filter((a) => a.date === date && a.status !== "cancelled")
}

export function createAppointment(input: CreateAppointmentInput): Appointment {
  ensureStore()
  const appointments = getAppointments()

  const totalPriceMinor = input.services.reduce((sum, s) => sum + s.priceMinor, 0)
  const totalDurationMinutes = input.services.reduce((sum, s) => sum + s.durationMinutes, 0)

  const appointment: Appointment = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    services: input.services,
    totalPriceMinor,
    totalDurationMinutes,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    date: input.date,
    time: input.time,
    note: input.note,
    coupon: input.coupon,
    locale: input.locale,
    status: input.status ?? "new",
    staffId: input.staffId,
  }

  appointments.push(appointment)
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), "utf-8")

  return appointment
}

export function getAppointmentById(id: string): Appointment | undefined {
  return getAppointments().find((a) => a.id === id)
}

export function updateAppointment(
  id: string,
  input: UpdateAppointmentInput
): Appointment | null {
  ensureStore()
  const appointments = getAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index === -1) return null

  const current = appointments[index]
  const updated: Appointment = {
    ...current,
    ...input,
    staffId: input.staffId === null ? undefined : (input.staffId ?? current.staffId),
  }
  appointments[index] = updated
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), "utf-8")
  return updated
}
