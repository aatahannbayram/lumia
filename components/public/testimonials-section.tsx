import Image from "next/image"
import { useTranslations } from "next-intl"
import { Star } from "lucide-react"

import { SectionHeading } from "@/components/public/section-heading"
import { TESTIMONIALS } from "@/lib/data/testimonials"

export function TestimonialsSection() {
  const t = useTranslations("Home")
  const tQuotes = useTranslations("Testimonials")

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow={t("testimonialsEyebrow")}
        title={t("testimonialsTitle")}
        align="center"
      />

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-white p-6 shadow-soft"
          >
            <div className="flex gap-0.5 text-lumia-gold">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              &ldquo;{tQuotes(testimonial.quoteKey)}&rdquo;
            </p>
            <div className="mt-auto flex items-center gap-3 pt-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
              </div>
              <span className="font-heading text-sm font-semibold text-lumia-dark">
                {testimonial.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
