import { NhostClient } from "@nhost/nextjs"

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
const region = process.env.NEXT_PUBLIC_NHOST_REGION

if (!subdomain || !region) {
  console.warn(
    "[nhost] NEXT_PUBLIC_NHOST_SUBDOMAIN / NEXT_PUBLIC_NHOST_REGION eksik — Nhost client pasif."
  )
}

/** Shared browser + client Nhost instance (Auth / Storage / GraphQL). */
export const nhost = new NhostClient({
  subdomain: subdomain || "placeholder",
  region: region || "eu-central-1",
})

export const nhostConfigured = Boolean(subdomain && region)

export function getNhostGraphqlUrl() {
  if (!subdomain || !region) return null
  return `https://${subdomain}.graphql.${region}.nhost.run/v1`
}

export function getNhostStorageUrl() {
  if (!subdomain || !region) return null
  return `https://${subdomain}.storage.${region}.nhost.run/v1`
}
