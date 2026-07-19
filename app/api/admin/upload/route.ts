import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

import { NextRequest, NextResponse } from "next/server"

import { getSession } from "@/lib/auth/server-session"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const form = await request.formData().catch(() => null)
  const file = form?.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 })
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 400 })
  }

  const ext = EXT[file.type] ?? "jpg"
  const filename = `${randomUUID()}.${ext}`
  const dir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(dir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
