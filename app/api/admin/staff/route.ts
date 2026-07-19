import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  createStaffMember,
  deleteStaffMember,
  getStaffMembers,
  updateStaffMember,
} from "@/lib/admin-staff-store"
import { getSession } from "@/lib/auth/server-session"

const imagePath = z
  .string()
  .min(1)
  .refine(
    (v) => v.startsWith("/uploads/") || v.startsWith("https://") || v.startsWith("http://"),
    "Geçersiz görsel yolu"
  )

const patchSchema = z.object({
  id: z.string(),
  patch: z.object({
    name: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
    photo: imagePath.or(z.literal("")).optional(),
    hoursStart: z.string().optional(),
    hoursEnd: z.string().optional(),
    active: z.boolean().optional(),
  }),
})

const createSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: imagePath.or(z.literal("")).default(""),
  hoursStart: z.string().default("09:00"),
  hoursEnd: z.string().default("20:00"),
  active: z.boolean().default(true),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  return NextResponse.json({ staff: getStaffMembers() })
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 })

  const updated = updateStaffMember(parsed.data.id, parsed.data.patch)
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json({ member: updated })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 })

  const member = createStaffMember(parsed.data)
  return NextResponse.json({ member })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const id = request.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "invalid_input" }, { status: 400 })

  deleteStaffMember(id)
  return NextResponse.json({ ok: true })
}
