"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { whatsappHref } from "@/lib/site-config"

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5),
})

type ContactValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const t = useTranslations("Contact")
  const locale = useLocale()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (values: ContactValues) => {
    // Open synchronously inside the submit handler so it isn't treated as an
    // unrequested popup once we redirect it after the awaited request below.
    const whatsappWindow = window.open("", "_blank")

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      })
    } catch {
      // Email is a best-effort side channel — WhatsApp handoff below still proceeds.
    }

    const message = `Merhaba Lumia,\n\nAd Soyad: ${values.name}\nTelefon: ${values.phone}${
      values.email ? `\nE-posta: ${values.email}` : ""
    }\nMesaj: ${values.message}`
    const targetUrl = whatsappHref(message)

    if (whatsappWindow) {
      whatsappWindow.location.href = targetUrl
    } else {
      window.open(targetUrl, "_blank")
    }

    toast.success(t("formSubmit"))
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{t("formName")}</Label>
        <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">{t("formPhone")}</Label>
        <Input id="phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("formEmail")}</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">{t("formMessage")}</Label>
        <Textarea id="message" {...register("message")} aria-invalid={!!errors.message} />
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {t("formSubmit")}
      </Button>
    </form>
  )
}
