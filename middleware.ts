import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

import { SESSION_COOKIE, verifySessionToken } from "./lib/auth/session"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login"
    const token = request.cookies.get(SESSION_COOKIE)?.value
    const authenticated = await verifySessionToken(token)

    if (isLoginPage) {
      if (authenticated) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.next()
    }

    if (!authenticated) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
