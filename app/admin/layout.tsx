import type { Metadata } from "next"

import { poppins } from "@/lib/fonts"
import { NhostAppProvider } from "@/components/providers/nhost-provider"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Lumia Admin",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={poppins.variable}>
      <body
        style={{ "--font-heading": "var(--font-poppins)", "--font-body": "var(--font-poppins)" } as React.CSSProperties}
        className="bg-muted/40"
      >
        <NhostAppProvider>{children}</NhostAppProvider>
      </body>
    </html>
  )
}
