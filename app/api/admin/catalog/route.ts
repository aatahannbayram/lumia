import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  createAdminService,
  deleteAdminService,
  getAdminCatalog,
  saveAdminCatalog,
  updateAdminCategory,
  updateAdminService,
} from "@/lib/admin-catalog-store"
import { getSession } from "@/lib/auth/server-session"

const servicePatchSchema = z.object({
  type: z.literal("service"),
  slug: z.string(),
  patch: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.enum(["hair", "nail"]).optional(),
    priceMinor: z.number().int().nonnegative().optional(),
    durationMinutes: z.number().int().positive().optional(),
    active: z.boolean().optional(),
    image: z
      .string()
      .refine(
        (v) =>
          !v ||
          v.startsWith("/uploads/") ||
          v.startsWith("https://") ||
          v.startsWith("http://"),
        "Geçersiz görsel yolu"
      )
      .optional(),
  }),
})

const serviceCreateSchema = z.object({
  type: z.literal("service_create"),
  service: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    category: z.enum(["hair", "nail"]),
    priceMinor: z.number().int().nonnegative(),
    durationMinutes: z.number().int().positive(),
    active: z.boolean().optional(),
    image: z
      .string()
      .refine(
        (v) =>
          !v ||
          v.startsWith("/uploads/") ||
          v.startsWith("https://") ||
          v.startsWith("http://"),
        "Geçersiz görsel yolu"
      )
      .optional(),
    slug: z.string().optional(),
  }),
})

const categoryPatchSchema = z.object({
  type: z.literal("category"),
  id: z.enum(["hair", "nail"]),
  patch: z.object({
    label: z.string().min(1).optional(),
    emoji: z.string().optional(),
    icon: z.string().optional(),
  }),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  return NextResponse.json(getAdminCatalog())
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const serviceParsed = servicePatchSchema.safeParse(body)
  if (serviceParsed.success) {
    const updated = updateAdminService(serviceParsed.data.slug, serviceParsed.data.patch)
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 })
    return NextResponse.json({ service: updated })
  }

  const categoryParsed = categoryPatchSchema.safeParse(body)
  if (categoryParsed.success) {
    const updated = updateAdminCategory(categoryParsed.data.id, categoryParsed.data.patch)
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 })
    return NextResponse.json({ category: updated })
  }

  return NextResponse.json({ error: "invalid_input" }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const createParsed = serviceCreateSchema.safeParse(body)
  if (!createParsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const created = createAdminService(createParsed.data.service)
  if (!created) return NextResponse.json({ error: "slug_exists" }, { status: 409 })
  return NextResponse.json({ service: created })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "invalid_input" }, { status: 400 })

  const ok = deleteAdminService(slug)
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  if (!body?.services || !body?.categories) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }
  saveAdminCatalog(body)
  return NextResponse.json({ ok: true })
}
