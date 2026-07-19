import { NextRequest, NextResponse } from "next/server"

import { getAppointmentsByDate } from "@/lib/appointments-store"
import { getAvailableSlots } from "@/lib/availability"

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date")
  const duration = Number(request.nextUrl.searchParams.get("duration") ?? "30")

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 })
  }

  const existing = getAppointmentsByDate(date)
  const slots = getAvailableSlots(existing, duration)

  return NextResponse.json({ slots })
}
