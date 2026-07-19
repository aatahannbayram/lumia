"use client"

import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react"

import type { AdminService } from "@/lib/admin-catalog-store"
import { CategoryIcon } from "@/lib/category-icons"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/admin/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ServicesEditorProps {
  initialServices: AdminService[]
  categories: { id: string; label: string; emoji: string; icon?: string }[]
}

function emptyService(): AdminService {
  return {
    slug: "",
    name: "",
    description: "",
    category: "hair",
    priceMinor: 50000,
    durationMinutes: 45,
    active: true,
    image: "",
  }
}

export function ServicesEditor({ initialServices, categories }: ServicesEditorProps) {
  const router = useRouter()
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<AdminService | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(emptyService())
    setIsNew(true)
  }

  async function saveService() {
    if (!editing) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch("/api/admin/catalog", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "service_create",
            service: {
              name: editing.name,
              description: editing.description,
              category: editing.category,
              priceMinor: editing.priceMinor,
              durationMinutes: editing.durationMinutes,
              active: editing.active,
              image: editing.image || undefined,
            },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setServices((prev) => [...prev, data.service])
          setEditing(null)
          setIsNew(false)
          startTransition(() => router.refresh())
        }
      } else {
        const res = await fetch("/api/admin/catalog", {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "service",
            slug: editing.slug,
            patch: {
              name: editing.name,
              description: editing.description,
              category: editing.category,
              priceMinor: editing.priceMinor,
              durationMinutes: editing.durationMinutes,
              active: editing.active,
              image: editing.image || undefined,
            },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setServices((prev) =>
            prev.map((s) => (s.slug === editing.slug ? data.service : s))
          )
          setEditing(null)
          startTransition(() => router.refresh())
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function removeService(slug: string) {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return
    const res = await fetch(`/api/admin/catalog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      credentials: "same-origin",
    })
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.slug !== slug))
      startTransition(() => router.refresh())
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {services.length} hizmet · Web sitesinde aktif olanlar görünür
        </p>
        <Button variant="dark" size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          Yeni Hizmet
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => {
          const cat = categories.find((c) => c.id === s.category)
          return (
            <Card key={s.slug} className="overflow-hidden border-border/50 bg-white shadow-sm">
              <div
                className="h-28 bg-muted bg-cover bg-center"
                style={s.image ? { backgroundImage: `url(${s.image})` } : undefined}
              />
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-2 font-heading font-semibold text-lumia-dark">
                      <CategoryIcon
                        categoryId={s.category}
                        icon={cat?.icon}
                        size="sm"
                        className="!from-neutral-800 !to-neutral-600 shadow-none ring-1 ring-black/5"
                      />
                      <span className="truncate">{s.name}</span>
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cat?.label} · {s.durationMinutes} dk
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                      s.active
                        ? "bg-neutral-100 text-neutral-700"
                        : "bg-neutral-50 text-neutral-400"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        s.active ? "bg-neutral-800" : "bg-neutral-300"
                      )}
                    />
                    {s.active ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="font-heading text-lg font-bold tabular-nums text-lumia-dark">
                    {formatPrice(s.priceMinor, "tr")}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border/60 bg-white hover:border-neutral-300 hover:bg-neutral-50 hover:text-lumia-dark"
                      onClick={() => {
                        setEditing({ ...s })
                        setIsNew(false)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Düzenle</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => removeService(s.slug)}
                      aria-label="Sil"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNew ? "Yeni Hizmet Ekle" : "Hizmet Düzenle"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Hizmet Adı</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Örn. Keratin Bakım"
                />
              </div>
              <div>
                <Label>Kısa Açıklama</Label>
                <Textarea
                  rows={2}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Web sitesinde görünecek açıklama"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Fiyat (₺)</Label>
                  <Input
                    type="number"
                    value={editing.priceMinor / 100}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priceMinor: Math.round(Number(e.target.value) * 100),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Süre (dk)</Label>
                  <Input
                    type="number"
                    value={editing.durationMinutes}
                    onChange={(e) =>
                      setEditing({ ...editing, durationMinutes: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Kategori</Label>
                <Select
                  value={editing.category}
                  onValueChange={(v) =>
                    setEditing({ ...editing, category: v as AdminService["category"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ImageUpload
                label="Görsel"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                Web sitesinde aktif
              </label>
              <Button
                variant="dark"
                className="w-full"
                onClick={saveService}
                disabled={saving || !editing.name.trim()}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isNew ? "Hizmeti Ekle" : "Kaydet"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
