export const SESSION_COOKIE = "lumia_admin_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "lumia-dev-session-secret"
  )
}

async function hmacHex(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "hex"))
    .join("")
}

export async function createSessionToken() {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000)
  return `${exp}.${await hmacHex(exp)}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const dot = token.lastIndexOf(".")
  if (dot === -1) return false
  const payload = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  const expected = await hmacHex(payload)
  if (signature.length !== expected.length) return false

  let match = 0
  for (let i = 0; i < signature.length; i++) {
    match |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  if (match !== 0) return false

  const exp = Number(payload)
  return Number.isFinite(exp) && exp > Date.now()
}

export function verifyAdminCredentials(user: string, pass: string) {
  const adminUser = process.env.ADMIN_USER
  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminUser || !adminPass) return false
  return user === adminUser && pass === adminPass
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  }
}
