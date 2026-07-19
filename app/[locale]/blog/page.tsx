import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowRight, Clock } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { getAllBlogPosts } from "@/lib/data/blog-posts"
import { site } from "@/lib/site-config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Blog" })
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `https://${site.domain}/${locale}/blog`,
      languages: {
        tr: `https://${site.domain}/tr/blog`,
        en: `https://${site.domain}/en/blog`,
        ar: `https://${site.domain}/ar/blog`,
        ru: `https://${site.domain}/ru/blog`,
      },
    },
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      type: "website",
      url: `https://${site.domain}/${locale}/blog`,
    },
  }
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Blog" })
  const posts = getAllBlogPosts()

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-lumia-coffee">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-lumia-dark sm:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("pageDescription")}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingMinutes} {t("minRead")}
                </span>
              </div>
              <h2 className="mt-2 font-heading text-xl font-semibold text-lumia-dark">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-lumia-dark/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-lumia-dark"
              >
                {t("readMore")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
