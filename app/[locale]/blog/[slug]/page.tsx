import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowLeft, Clock } from "lucide-react"

import type { Locale } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/data/blog-posts"
import { getBlogPostJsonLd, getBreadcrumbJsonLd } from "@/lib/schema"
import { site } from "@/lib/site-config"
import { Button } from "@/components/ui/button"

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}
  const url = `https://${site.domain}/${locale}/blog/${slug}`
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        (["tr", "en", "ar", "ru"] as const).map((l) => [
          l,
          `https://${site.domain}/${l}/blog/${slug}`,
        ])
      ),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: [{ url: post.coverImage }],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: "Blog" })
  const related = getRelatedBlogPosts(slug)
  const articleLd = getBlogPostJsonLd(post, locale)
  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Lumia", url: `https://${site.domain}/${locale}` },
    { name: t("pageTitle"), url: `https://${site.domain}/${locale}/blog` },
    { name: post.title, url: `https://${site.domain}/${locale}/blog/${slug}` },
  ])

  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="text-sm text-muted-foreground">
        <Link href="/blog" className="inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("pageTitle")}
        </Link>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingMinutes} {t("minRead")}
          </span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-lumia-dark sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-lumia-dark/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.25rem]">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="prose-lumia mt-10 space-y-5 text-[15px] leading-relaxed text-foreground/85 sm:text-base">
        {post.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-lumia-dark px-6 py-8 text-white sm:px-8">
        <h2 className="font-heading text-xl font-semibold">{t("ctaTitle")}</h2>
        <p className="mt-2 max-w-lg text-sm text-white/70">{t("ctaDescription")}</p>
        <Button asChild size="lg" variant="secondary" className="mt-5">
          <Link href="/randevu">{t("ctaButton")}</Link>
        </Button>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-heading text-lg font-semibold text-lumia-dark">
            {t("relatedTitle")}
          </h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="flex gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={r.coverImage} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-lumia-dark">{r.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {r.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
