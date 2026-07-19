export interface AppointmentServiceLine {
  slug: string
  name: string
  priceMinor: number
  durationMinutes: number
}

export interface Appointment {
  id: string
  createdAt: string
  services: AppointmentServiceLine[]
  totalPriceMinor: number
  totalDurationMinutes: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  note?: string
  coupon?: string
  locale: string
  status: "new" | "confirmed" | "completed" | "cancelled" | "no_show"
  staffId?: string
}

export type AppointmentStatus = Appointment["status"]

export interface CreateAppointmentInput {
  services: AppointmentServiceLine[]
  customerName: string
  customerPhone: string
  customerEmail?: string
  date: string
  time: string
  note?: string
  coupon?: string
  locale: string
  status?: AppointmentStatus
  staffId?: string
}

export interface UpdateAppointmentInput {
  status?: AppointmentStatus
  staffId?: string | null
  note?: string
}
