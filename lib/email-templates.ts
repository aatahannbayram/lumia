import "server-only"
import type { Appointment } from "@/types/appointment"
import { site } from "@/lib/site-config"

type Locale = "tr" | "en" | "ar" | "ru"

function isRtl(locale: Locale) {
  return locale === "ar"
}

function formatPriceServer(priceMinor: number, locale: string) {
  return new Intl.NumberFormat(`${locale}-u-nu-latn`, {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(priceMinor / 100)
}

function shell(locale: Locale, title: string, bodyHtml: string) {
  const dir = isRtl(locale) ? "rtl" : "ltr"
  const align = isRtl(locale) ? "right" : "left"

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F7F6F4;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F6F4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px -8px rgba(31,30,28,0.08);">
            <tr>
              <td style="background-color:#1F1E1C;padding:28px 32px;" align="${align}">
                <span style="font-size:22px;font-weight:700;color:#F7F6F4;letter-spacing:0.02em;">Lumia</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;" align="${align}" dir="${dir}">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#F0EFEC;" align="${align}" dir="${dir}">
                <span style="font-size:12px;color:#4A4845;">
                  ${site.name} · ${site.address.full} · ${site.phoneDisplay}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:4px 0;font-size:13px;color:#6B6966;width:140px;">${label}</td>
    <td style="padding:4px 0;font-size:14px;color:#1F1E1C;font-weight:600;">${value}</td>
  </tr>`
}

const dict = {
  tr: {
    contactSubject: "Yeni İletişim Formu Mesajı",
    contactHeading: "Yeni bir mesajınız var",
    name: "Ad Soyad",
    phone: "Telefon",
    email: "E-posta",
    message: "Mesaj",
    apptBusinessSubject: "Yeni Randevu Talebi",
    apptBusinessHeading: "Yeni bir randevu talebi geldi",
    apptCustomerSubject: "Randevu Talebiniz Alındı — Lumia",
    apptCustomerHeading: (name: string) => `Merhaba ${name}, randevu talebiniz alındı`,
    apptCustomerBody:
      "Ekibimiz en kısa sürede WhatsApp veya telefon üzerinden sizinle iletişime geçip randevunuzu onaylayacak.",
    date: "Tarih",
    time: "Saat",
    services: "Hizmetler",
    total: "Toplam",
    note: "Not",
  },
  en: {
    contactSubject: "New Contact Form Message",
    contactHeading: "You have a new message",
    name: "Full Name",
    phone: "Phone",
    email: "Email",
    message: "Message",
    apptBusinessSubject: "New Appointment Request",
    apptBusinessHeading: "A new appointment request came in",
    apptCustomerSubject: "Your Appointment Request Was Received — Lumia",
    apptCustomerHeading: (name: string) => `Hi ${name}, your request was received`,
    apptCustomerBody:
      "Our team will reach out via WhatsApp or phone shortly to confirm your appointment.",
    date: "Date",
    time: "Time",
    services: "Services",
    total: "Total",
    note: "Note",
  },
  ar: {
    contactSubject: "رسالة جديدة من نموذج التواصل",
    contactHeading: "لديك رسالة جديدة",
    name: "الاسم الكامل",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    apptBusinessSubject: "طلب حجز جديد",
    apptBusinessHeading: "وصل طلب حجز جديد",
    apptCustomerSubject: "تم استلام طلب حجزك — لوميا",
    apptCustomerHeading: (name: string) => `مرحباً ${name}، تم استلام طلبك`,
    apptCustomerBody: "سيتواصل معك فريقنا قريباً عبر واتساب أو الهاتف لتأكيد موعدك.",
    date: "التاريخ",
    time: "الوقت",
    services: "الخدمات",
    total: "الإجمالي",
    note: "ملاحظة",
  },
  ru: {
    contactSubject: "Новое сообщение с формы обратной связи",
    contactHeading: "У вас новое сообщение",
    name: "Имя и фамилия",
    phone: "Телефон",
    email: "Эл. почта",
    message: "Сообщение",
    apptBusinessSubject: "Новая заявка на запись",
    apptBusinessHeading: "Поступила новая заявка на запись",
    apptCustomerSubject: "Ваша заявка принята — Lumia",
    apptCustomerHeading: (name: string) => `Здравствуйте, ${name}, ваша заявка принята`,
    apptCustomerBody: "Наша команда свяжется с вами через WhatsApp или по телефону для подтверждения записи.",
    date: "Дата",
    time: "Время",
    services: "Услуги",
    total: "Итого",
    note: "Комментарий",
  },
} satisfies Record<Locale, Record<string, string | ((name: string) => string)>>

function getDict(locale: string) {
  return dict[(locale as Locale) in dict ? (locale as Locale) : "tr"]
}

export function contactNotificationEmail(
  locale: string,
  data: { name: string; phone: string; email?: string; message: string }
) {
  const t = getDict(locale)
  const body = `
    <h1 style="font-size:20px;color:#1F1E1C;margin:0 0 20px;">${t.contactHeading}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
      ${row(t.name as string, data.name)}
      ${row(t.phone as string, data.phone)}
      ${data.email ? row(t.email as string, data.email) : ""}
    </table>
    <p style="font-size:13px;color:#6B6966;margin:0 0 4px;">${t.message}</p>
    <p style="font-size:14px;color:#1F1E1C;white-space:pre-wrap;margin:0;">${data.message}</p>
  `
  return { subject: t.contactSubject as string, html: shell(locale as Locale, t.contactSubject as string, body) }
}

export function appointmentBusinessEmail(locale: string, appointment: Appointment) {
  const t = getDict(locale)
  const servicesList = appointment.services.map((s) => s.name).join(", ")
  const body = `
    <h1 style="font-size:20px;color:#1F1E1C;margin:0 0 20px;">${t.apptBusinessHeading}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
      ${row(t.name as string, appointment.customerName)}
      ${row(t.phone as string, appointment.customerPhone)}
      ${row(t.date as string, appointment.date)}
      ${row(t.time as string, appointment.time)}
      ${row(t.services as string, servicesList)}
      ${row(t.total as string, formatPriceServer(appointment.totalPriceMinor, locale))}
      ${appointment.note ? row(t.note as string, appointment.note) : ""}
    </table>
  `
  return {
    subject: t.apptBusinessSubject as string,
    html: shell(locale as Locale, t.apptBusinessSubject as string, body),
  }
}

export function appointmentCustomerEmail(locale: string, appointment: Appointment) {
  const t = getDict(locale)
  const heading = (t.apptCustomerHeading as (name: string) => string)(appointment.customerName)
  const servicesList = appointment.services.map((s) => s.name).join(", ")
  const body = `
    <h1 style="font-size:20px;color:#1F1E1C;margin:0 0 12px;">${heading}</h1>
    <p style="font-size:14px;color:#4A4845;margin:0 0 20px;">${t.apptCustomerBody}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      ${row(t.date as string, appointment.date)}
      ${row(t.time as string, appointment.time)}
      ${row(t.services as string, servicesList)}
      ${row(t.total as string, formatPriceServer(appointment.totalPriceMinor, locale))}
    </table>
  `
  return {
    subject: t.apptCustomerSubject as string,
    html: shell(locale as Locale, t.apptCustomerSubject as string, body),
  }
}
