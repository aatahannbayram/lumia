import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  createNewsItem,
  deleteNewsItem,
  getNewsItems,
  updateNewsItem,
} from "@/lib/admin-news-store"
import { getSession } from "@/lib/auth/server-session"

const imagePath = z
  .string()
  .refine(
    (v) =>
      !v ||
      v.startsWith("/uploads/") ||
      v.startsWith("https://") ||
      v.startsWith("http://"),
    "Geçersiz görsel"
  )

const createSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  image: imagePath.optional(),
  date: z.string().optional(),
  tag: z.string().optional(),
  published: z.boolean().optional(),
  slug: z.string().optional(),
})

const patchSchema = z.object({
  id: z.string(),
  patch: z.object({
    title: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    image: imagePath.optional(),
    date: z.string().optional(),
    tag: z.string().optional(),
    published: z.boolean().optional(),
    slug: z.string().optional(),
  }),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  return NextResponse.json({ news: getNewsItems() })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 })

  const created = createNewsItem({
    ...parsed.data,
    image: parsed.data.image || "",
    date: parsed.data.date || new Date().toISOString().slice(0, 10),
    tag: parsed.data.tag || "Duyuru",
    published: parsed.data.published ?? true,
    content: parsed.data.content,
    summary: parsed.data.summary,
    title: parsed.data.title,
  })
  if (!created) return NextResponse.json({ error: "slug_exists" }, { status: 409 })
  return NextResponse.json({ item: created })
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 })

  const updated = updateNewsItem(parsed.data.id, parsed.data.patch)
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 })
  return NextResponse.json({ item: updated })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const id = request.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  deleteNewsItem(id)
  return NextResponse.json({ ok: true })
}
