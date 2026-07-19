"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarCheck, Check, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { CategoryIcon } from "@/lib/category-icons"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format"
import { resolveServiceName } from "@/lib/service-display"
import { whatsappHref } from "@/lib/site-config"
import type { Service } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookingCalendar } from "@/components/public/booking-calendar"

interface BookingFlowProps {
  categoryIcons?: Record<string, string>
  services: Service[]
}

export function BookingFlow({ categoryIcons = {}, services }: BookingFlowProps) {
  const t = useTranslations("Booking")
  const tItems = useTranslations("ServiceItems")
  const tServices = useTranslations("Services")
  const locale = useLocale()

  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [coupon, setCoupon] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [availabilityKey, setAvailabilityKey] = useState(0)

  const cartItems = useMemo(
    () => services.filter((s) => selected.has(s.slug)),
    [selected, services]
  )
  const totalPrice = cartItems.reduce((sum, s) => sum + s.priceMinor, 0)
  const totalDuration = cartItems.reduce((sum, s) => sum + s.durationMinutes, 0)
  const isEmpty = cartItems.length === 0
  const canConfirm =
    !isEmpty && name.trim().length > 1 && phone.trim().length > 4 && !!date && !!time

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  function remove(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(slug)
      return next
    })
  }

  function handleSelectDate(nextDate: string) {
    setDate(nextDate)
    setTime(null)
  }

  async function handleConfirm() {
    if (!canConfirm || !date || !time) return
    setSubmitting(true)

    // Open the tab synchronously, inside the click handler, so browsers don't
    // treat it as an unrequested popup once we redirect it after the await below.
    const whatsappWindow = window.open("", "_blank")

    const servicesPayload = cartItems.map((s) => ({
      slug: s.slug,
      name: resolveServiceName(s, (key) => tItems(key)),
      priceMinor: s.priceMinor,
      durationMinutes: s.durationMinutes,
    }))

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: servicesPayload,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || undefined,
          date,
          time,
          note: note || undefined,
          coupon: coupon || undefined,
          locale,
        }),
      })
      if (res.status === 409) {
        whatsappWindow?.close()
        toast.error(t("slotTakenError"))
        setTime(null)
        setAvailabilityKey((k) => k + 1)
        setSubmitting(false)
        return
      }
      if (!res.ok) throw new Error("failed")
    } catch {
      whatsappWindow?.close()
      toast.error(t("saveError"))
      setSubmitting(false)
      return
    }

    const lines = [
      t("waGreeting"),
      "",
      `${t("waServicesLabel")}:`,
      ...cartItems.map(
        (s) => `• ${resolveServiceName(s, (key) => tItems(key))} — ${formatPrice(s.priceMinor, locale)}`
      ),
      `${t("waTotalLabel")}: ${formatPrice(totalPrice, locale)} (~${totalDuration} ${tServices("minutesShort")})`,
      "",
      `${t("waDateLabel")}: ${date} ${time}`,
      `${t("waNameLabel")}: ${name}`,
      `${t("waPhoneLabel")}: ${phone}`,
    ]
    if (coupon.trim()) lines.push(`${t("waCouponLabel")}: ${coupon}`)
    if (note.trim()) lines.push(`${t("waNoteLabel")}: ${note}`)

    const targetUrl = whatsappHref(lines.join("\n"))
    if (whatsappWindow) {
      whatsappWindow.location.href = targetUrl
    } else {
      // Popup was blocked even for the synchronous open (rare) — fall back to a direct navigation.
      window.open(targetUrl, "_blank")
    }
    setSubmitting(false)
    toast.success(t("saveSuccess"), { icon: "🎉" })
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <StepBar active={true} label={t("stepService")} index={1} />
          <StepBar active={step === 2} label={t("stepDetails")} index={2} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-muted-foreground">{t("selectPrompt")}</p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {services.map((service) => {
                    const isSelected = selected.has(service.slug)
                    const serviceName = resolveServiceName(service, (key) => tItems(key))
                    return (
                      <button
                        key={service.slug}
                        type="button"
                        onClick={() => toggle(service.slug)}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl border p-3 text-start transition-all",
                          isSelected
                            ? "border-lumia-dark bg-lumia-dark/[0.03] shadow-soft"
                            : "border-border/60 bg-white hover:border-lumia-dark/30"
                        )}
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={service.image}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-heading text-sm font-semibold text-lumia-dark">
                            <span className="mr-1.5 inline-flex align-middle">
                              <CategoryIcon
                                categoryId={service.category}
                                icon={categoryIcons[service.category]}
                                size="sm"
                              />
                            </span>
                            {serviceName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {service.durationMinutes} {tServices("minutesShort")} ·{" "}
                            {formatPrice(service.priceMinor, locale)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                            isSelected
                              ? "bg-lumia-dark text-white"
                              : "bg-muted text-foreground/50 group-hover:bg-lumia-dark/10"
                          )}
                        >
                          {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <BookingCalendar
                  durationMinutes={totalDuration}
                  selectedDate={date}
                  selectedTime={time}
                  onSelectDate={handleSelectDate}
                  onSelectTime={setTime}
                  refreshKey={availabilityKey}
                />

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">{t("formName")}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">{t("formPhone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">{t("formEmail")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="note">{t("formNote")}</Label>
                  <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                    {t("backStep")}
                  </Button>
                  <Button
                    size="lg"
                    disabled={!canConfirm || submitting}
                    onClick={handleConfirm}
                    className="gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CalendarCheck className="h-4 w-4" />
                    )}
                    {t("confirmCta")}
                  </Button>
                </div>
                {!date || !time ? (
                  <p className="max-w-sm text-xs text-amber-700">{t("selectDateFirst")}</p>
                ) : (
                  <p className="max-w-sm text-xs text-muted-foreground">{t("confirmHint")}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart summary */}
        <div className="h-fit rounded-2xl border border-border/60 bg-white p-6 shadow-soft lg:sticky lg:top-28">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-lumia-dark">
            <span aria-hidden="true">🛍️</span>
            {t("cartTitle")}
          </h2>

          {isEmpty ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-xl bg-muted/50 px-4 py-8 text-center">
              <span aria-hidden="true" className="text-2xl">
                💭
              </span>
              <p className="text-sm font-medium text-foreground/70">{t("cartEmpty")}</p>
              <p className="text-xs text-muted-foreground">{t("cartEmptyHint")}</p>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {cartItems.map((service) => (
                  <motion.li
                    key={service.slug}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between gap-2 overflow-hidden rounded-lg bg-muted/50 px-3 py-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => remove(service.slug)}
                      aria-label="remove"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-foreground/50 shadow-sm transition-colors hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex-1 truncate text-sm font-medium text-foreground/85">
                      {resolveServiceName(service, (key) => tItems(key))}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-lumia-dark">
                      {formatPrice(service.priceMinor, locale)}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {date && time && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-lumia-gold/15 px-3 py-2.5 text-sm font-medium text-lumia-coffee">
              <span aria-hidden="true">📅</span>
              {date} · {time}
            </div>
          )}

          {!isEmpty && step === 1 && (
            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="coupon" className="text-xs text-muted-foreground">
                {t("couponLabel")}
              </Label>
              <Input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder={t("couponPlaceholder")}
                className="h-10"
              />
            </div>
          )}

          <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("durationTotal")}</span>
              <span>
                {totalDuration} {tServices("minutesShort")}
              </span>
            </div>
            <div className="flex justify-between font-heading text-base font-semibold text-lumia-dark">
              <span>{t("priceTotal")}</span>
              <span>{formatPrice(totalPrice, locale)}</span>
            </div>
          </div>

          {step === 1 && (
            <Button
              size="lg"
              disabled={isEmpty}
              onClick={() => setStep(2)}
              className="mt-5 w-full"
            >
              {t("nextStep")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepBar({ active, label, index }: { active: boolean; label: string; index: number }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div
        className={cn(
          "h-1.5 rounded-full transition-colors duration-300",
          active ? "bg-lumia-dark" : "bg-border"
        )}
      />
      <span
        className={cn(
          "text-xs font-medium transition-colors",
          active ? "text-lumia-dark" : "text-muted-foreground"
        )}
      >
        {index}. {label}
      </span>
    </div>
  )
}
