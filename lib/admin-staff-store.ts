import "server-only"
import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"

import { media } from "@/lib/data/media"
import type { StaffMember } from "@/types"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "admin-staff.json")

export interface AdminStaffMember extends StaffMember {
  hoursStart: string
  hoursEnd: string
  active: boolean
}

const DEFAULT_STAFF: AdminStaffMember[] = [
  {
    id: "s1",
    name: "Ayşe Demir",
    role: "Saç Tasarım Uzmanı",
    photo: media.team1,
    hoursStart: "09:00",
    hoursEnd: "20:00",
    active: true,
  },
  {
    id: "s2",
    name: "Zeynep Kaya",
    role: "Renk Uzmanı",
    photo: media.team2,
    hoursStart: "09:00",
    hoursEnd: "20:00",
    active: true,
  },
  {
    id: "s3",
    name: "Naz Yıldız",
    role: "Tırnak Bakım Uzmanı",
    photo: media.team3,
    hoursStart: "09:00",
    hoursEnd: "20:00",
    active: true,
  },
]

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STAFF, null, 2), "utf-8")
  }
}

export function getStaffMembers(): AdminStaffMember[] {
  ensureStore()
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as AdminStaffMember[]
    return parsed.length ? parsed : DEFAULT_STAFF
  } catch {
    return DEFAULT_STAFF
  }
}

export function getActiveStaffMembers(): AdminStaffMember[] {
  return getStaffMembers().filter((m) => m.active)
}

export function updateStaffMember(id: string, patch: Partial<AdminStaffMember>) {
  const staff = getStaffMembers()
  const index = staff.findIndex((m) => m.id === id)
  if (index === -1) return null
  staff[index] = { ...staff[index], ...patch }
  fs.writeFileSync(DATA_FILE, JSON.stringify(staff, null, 2), "utf-8")
  return staff[index]
}

export function createStaffMember(input: Omit<AdminStaffMember, "id">) {
  const staff = getStaffMembers()
  const member: AdminStaffMember = {
    ...input,
    id: randomUUID(),
    photo: input.photo || media.team1,
  }
  staff.push(member)
  fs.writeFileSync(DATA_FILE, JSON.stringify(staff, null, 2), "utf-8")
  return member
}

export function deleteStaffMember(id: string) {
  const staff = getStaffMembers().filter((m) => m.id !== id)
  fs.writeFileSync(DATA_FILE, JSON.stringify(staff, null, 2), "utf-8")
}
