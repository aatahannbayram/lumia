import { site } from "@/lib/site-config"
import type { BlogPost } from "@/lib/data/blog-posts"

export function getLocalBusinessJsonLd({
  locale,
  description,
}: {
  locale: string
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    legalName: site.legalName,
    description,
    url: `https://${site.domain}/${locale}`,
    telephone: `+${site.phoneRaw}`,
    email: site.email,
    priceRange: site.priceRange,
    image: `https://${site.domain}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.district,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: site.workingHours.opens,
      closes: site.workingHours.closes,
    },
    ...(site.social.instagram ? { sameAs: [site.social.instagram] } : {}),
  }
}

export function getBlogPostJsonLd(post: BlogPost, locale: string) {
  const url = `https://${site.domain}/${locale}/blog/${post.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: site.name,
      url: `https://${site.domain}/${locale}`,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `https://${site.domain}/og-image.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
  }
}

export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
