import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { getAllBlogPosts } from "@/lib/data/blog-posts"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/public/section-heading"

export async function BlogTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Blog" })
  const posts = getAllBlogPosts().slice(0, 3)

  if (!posts.length) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={t("eyebrow")} title={t("homeTitle")} />
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/blog">{t("viewAll")}</Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <time className="text-[11px] text-muted-foreground" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <h3 className="mt-1.5 font-heading text-base font-semibold text-lumia-dark line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {post.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-lumia-dark">
                {t("readMore")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/blog">{t("viewAll")}</Link>
        </Button>
      </div>
    </section>
  )
}
