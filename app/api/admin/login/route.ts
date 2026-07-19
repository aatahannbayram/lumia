import { NextRequest, NextResponse } from "next/server"

import {
  createSessionToken,
  sessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/auth/session"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const user = typeof body?.user === "string" ? body.user : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!verifyAdminCredentials(user, password)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
  }

  const token = await createSessionToken()
  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionCookieOptions(token))
  return response
}
