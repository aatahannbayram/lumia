"use client"

import { NhostProvider } from "@nhost/nextjs"
import { NhostApolloProvider } from "@nhost/react-apollo"

import { nhost, nhostConfigured } from "@/lib/nhost"

export function NhostAppProvider({ children }: { children: React.ReactNode }) {
  if (!nhostConfigured) return <>{children}</>

  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>{children}</NhostApolloProvider>
    </NhostProvider>
  )
}
