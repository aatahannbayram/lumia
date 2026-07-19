"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { motion, useReducedMotion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight, Hand, Images, Scissors, Sparkle } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { media } from "@/lib/data/media"
import { rtlLocales, type Locale } from "@/i18n/routing"

const slides = [
  { src: media.heroPortrait, alt: "Lumia güzellik merkezinde saç bakımı" },
  { src: media.heroCardHair, alt: "Parlak ve sağlıklı saç şekillendirme" },
  { src: media.salonInteriorMono, alt: "Lumia salon atmosferi" },
]

export function Hero() {
  const t = useTranslations("Hero")
  const locale = useLocale()
  const isRtl = rtlLocales.includes(locale as Locale)
  const shouldReduceMotion = useReducedMotion()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRtl ? "rtl" : "ltr" },
    shouldReduceMotion ? [] : [Autoplay({ delay: 6000, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  const progress = ((selectedIndex + 1) / slides.length) * 100

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-lumia-dark">
      <div className="absolute inset-0 h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full">
          {slides.map((slide, i) => (
            <div key={i} className="relative h-full w-full flex-[0_0_100%]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                quality={70}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lumia-dark/95 via-lumia-dark/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lumia-dark/70 via-transparent to-transparent" />

      <Link
        href="/portfolyo"
        className="group absolute end-6 top-24 z-10 hidden flex-col items-center gap-2 sm:flex lg:end-12 lg:top-28"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
          <Images className="h-5 w-5" />
        </span>
        <span className="text-[11px] font-medium text-white/80">{t("galleryLabel")}</span>
      </Link>

      <div className="relative z-10 flex h-full w-full flex-col justify-end px-5 pb-10 pt-24 sm:px-10 sm:pb-12 sm:pt-28 lg:px-16">
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 max-w-sm text-base text-white/75 sm:text-lg"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href="/randevu">{t("ctaPrimary")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white"
            >
              <Link href="/hizmetler">{t("ctaSecondary")}</Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4"
          >
            <ArchIconCard
              href="/hizmet/sac-kesim"
              icon={Scissors}
              title={t("cardHairTitle")}
            />
            <ArchIconCard href="/hizmet/manikur" icon={Hand} title={t("cardNailTitle")} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex items-center gap-3"
          >
            <span className="font-heading text-xs text-white/50">0{selectedIndex + 1}</span>
            <div className="h-px w-14 overflow-hidden rounded-full bg-white/20 sm:w-20">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-heading text-xs text-white/50">0{slides.length}</span>

            <div className="ms-1 flex gap-1.5">
              <button
                aria-label="Previous slide"
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next slide"
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ArchIconCard({
  href,
  icon: Icon,
  title,
}: {
  href: string
  icon: typeof Scissors
  title: string
}) {
  return (
    <Link
      href={href}
      className="group flex w-28 flex-col items-center gap-3 rounded-t-full rounded-b-2xl border border-white/25 bg-white/10 pb-4 pt-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 sm:w-32"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
        <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
        <Sparkle className="absolute -end-1 -top-1 h-3.5 w-3.5 fill-lumia-gold text-lumia-gold" />
      </span>
      <span className="text-center text-xs font-semibold text-white">{title}</span>
    </Link>
  )
}
