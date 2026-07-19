import "server-only"
import { cookies } from "next/headers"

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session"

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return (await verifySessionToken(token)) ? { role: "owner" as const } : null
}
