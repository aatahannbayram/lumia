import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.storage.*.nhost.run" },
      {
        protocol: "https",
        hostname: "wvyloubhvxkcgqlkjfkp.storage.eu-central-1.nhost.run",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "lumiaclub.com" }],
        destination: "https://www.lumiaclub.com/:path*",
        permanent: true,
      },
      {
        source: "/:locale/blog",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/blog/:path*",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale/hakkimizda",
        destination: "/:locale",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
