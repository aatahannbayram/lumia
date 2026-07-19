import type { Appointment } from "@/types/appointment"

const OPEN_MINUTES = 9 * 60 // 09:00
const CLOSE_MINUTES = 20 * 60 // 20:00
const SLOT_STEP = 30

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/**
 * Returns every half-hour slot between opening and closing that can fit the
 * requested duration without overlapping an existing appointment.
 */
export function getAvailableSlots(
  existingAppointments: Appointment[],
  durationMinutes: number
): string[] {
  const busyRanges = existingAppointments.map((a) => {
    const start = timeToMinutes(a.time)
    return { start, end: start + a.totalDurationMinutes }
  })

  const slots: string[] = []
  for (
    let start = OPEN_MINUTES;
    start + durationMinutes <= CLOSE_MINUTES;
    start += SLOT_STEP
  ) {
    const end = start + durationMinutes
    const overlaps = busyRanges.some((range) => start < range.end && end > range.start)
    if (!overlaps) slots.push(minutesToTime(start))
  }

  return slots
}

export function isSlotInPast(dateISO: string, time: string) {
  const [year, month, day] = dateISO.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const slotDate = new Date(year, month - 1, day, hour, minute)
  return slotDate.getTime() < Date.now()
}
