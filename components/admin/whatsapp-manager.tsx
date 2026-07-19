"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MessageSquare,
  Play,
  Power,
  Send,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Automation {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: string
  template: string
}

interface LogEntry {
  id: string
  automationId: string
  customerName: string
  phone: string
  status: string
  sentAt: string
}

interface WhatsAppManagerProps {
  initialAutomations?: Automation[]
  initialLog?: LogEntry[]
  initialConfigured?: boolean
}

export function WhatsAppManager({
  initialAutomations = [],
  initialLog = [],
  initialConfigured = false,
}: WhatsAppManagerProps) {
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations)
  const [log, setLog] = useState<LogEntry[]>(initialLog)
  const [configured, setConfigured] = useState(initialConfigured)
  const [loading, setLoading] = useState(initialAutomations.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTemplate, setEditTemplate] = useState("")

  async function load() {
    try {
      const res = await fetch("/api/admin/whatsapp", { credentials: "same-origin" })
      if (!res.ok) {
        setError("Veriler yüklenemedi. Oturumu yenileyin.")
        return
      }
      const data = await res.json()
      setAutomations(data.automations ?? [])
      setLog(data.log ?? [])
      setConfigured(data.configured ?? false)
      setError(null)
    } catch {
      setError("Bağlantı hatası. Sayfayı yenileyin.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialAutomations.length === 0) load()
  }, [initialAutomations.length])

  async function toggleAutomation(id: string, enabled: boolean) {
    await fetch("/api/admin/whatsapp", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    })
    load()
  }

  async function saveTemplate(id: string) {
    await fetch("/api/admin/whatsapp", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, template: editTemplate }),
    })
    setEditingId(null)
    load()
  }

  async function runAutomations() {
    setRunning(true)
    await fetch("/api/admin/whatsapp", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "run" }),
    })
    await load()
    setRunning(false)
  }

  const triggerLabels: Record<string, string> = {
    appointment_created: "Randevu oluşunca",
    appointment_reminder_24h: "24 saat önce",
    appointment_completed: "Tamamlanınca",
    manual: "Manuel",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-white py-20 shadow-soft">
        <Loader2 className="h-6 w-6 animate-spin text-lumia-coffee" />
      </div>
    )
  }

  if (error && automations.length === 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-soft">
        <p className="font-medium text-red-800">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={load}>
          Tekrar Dene
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-white shadow-soft">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lumia-dark">
              <MessageSquare className="h-6 w-6 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-heading font-bold text-lumia-dark">WhatsApp Otomasyon</p>
              <p className="text-xs text-muted-foreground">
                {configured
                  ? "Cloud API bağlı — mesajlar otomatik gönderilir"
                  : "Simülasyon modu — wa.me ile manuel gönderim"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={configured ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-700"}>
              {configured ? "API Bağlı" : "Demo Mod"}
            </Badge>
            <Button variant="dark" size="sm" onClick={runAutomations} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Otomasyonları Çalıştır
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {automations.map((auto) => (
          <Card key={auto.id} className="border-border/60 bg-white shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base text-lumia-dark">
                    <Zap className="h-4 w-4" strokeWidth={1.75} />
                    {auto.name}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{auto.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAutomation(auto.id, !auto.enabled)}
                  className={`rounded-full p-2 transition-colors ${
                    auto.enabled ? "bg-lumia-dark text-white" : "bg-muted text-muted-foreground"
                  }`}
                  aria-label={auto.enabled ? "Kapat" : "Aç"}
                >
                  <Power className="h-4 w-4" />
                </button>
              </div>
              <Badge variant="secondary" className="mt-2 w-fit text-[10px]">
                {triggerLabels[auto.trigger] ?? auto.trigger}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingId === auto.id ? (
                <>
                  <div>
                    <Label className="text-xs">Mesaj şablonu</Label>
                    <p className="mb-1 text-[10px] text-muted-foreground">
                      Değişkenler: {"{{name}} {{date}} {{time}} {{services}}"}
                    </p>
                    <Textarea
                      rows={4}
                      value={editTemplate}
                      onChange={(e) => setEditTemplate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="dark" onClick={() => saveTemplate(auto.id)}>
                      Kaydet
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      İptal
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <pre className="whitespace-pre-wrap rounded-xl bg-muted/30 p-3 text-xs text-lumia-dark/80">
                    {auto.template}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(auto.id)
                      setEditTemplate(auto.template)
                    }}
                  >
                    Şablonu Düzenle
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 bg-white shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" strokeWidth={1.75} />
            Gönderim Geçmişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {log.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Henüz mesaj gönderilmedi. Otomasyonları çalıştırın veya yeni randevu oluşturun.
            </p>
          ) : (
            <div className="space-y-2">
              {log.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/40 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {entry.status === "sent" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : entry.status === "simulated" ? (
                      <Send className="h-4 w-4 text-amber-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-lumia-dark">{entry.customerName}</p>
                      <p className="text-xs text-muted-foreground">{entry.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-[10px]">
                      {entry.status === "sent" ? "Gönderildi" : entry.status === "simulated" ? "Simülasyon" : "Hata"}
                    </Badge>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(entry.sentAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!configured && (
        <Card className="border-dashed border-lumia-coffee/30 bg-lumia-cream/30">
          <CardContent className="p-5 text-sm">
            <p className="font-semibold text-lumia-dark">Tam otomasyon için WhatsApp Cloud API</p>
            <p className="mt-1 text-muted-foreground">
              Meta Business hesabınızdan API token alın ve .env.local dosyasına ekleyin:
            </p>
            <code className="mt-2 block rounded-lg bg-white px-3 py-2 text-xs">
              WHATSAPP_TOKEN=...{"\n"}WHATSAPP_PHONE_NUMBER_ID=...
            </code>
            <a
              href="https://developers.facebook.com/docs/whatsapp/cloud-api"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-lumia-coffee hover:underline"
            >
              API dokümantasyonu <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
