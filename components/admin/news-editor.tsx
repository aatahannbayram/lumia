"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { startTransition, useEffect, useState } from "react"
import { ExternalLink, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react"

import type { AdminNewsItem } from "@/lib/admin-news-store"
import { ImageUpload } from "@/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const TAGS = ["Kampanya", "Hizmet", "Ürün", "Duyuru", "Paket", "Başarı"]

function emptyNews(): AdminNewsItem {
  return {
    id: "",
    slug: "",
    title: "",
    summary: "",
    content: "",
    image: "",
    date: new Date().toISOString().slice(0, 10),
    tag: "Duyuru",
    published: true,
  }
}

export function NewsEditor({ initialNews }: { initialNews: AdminNewsItem[] }) {
  const router = useRouter()
  const [news, setNews] = useState(initialNews)
  const [editing, setEditing] = useState<AdminNewsItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setNews(initialNews)
  }, [initialNews])

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editing.title,
            summary: editing.summary,
            content: editing.content,
            image: editing.image || undefined,
            date: editing.date,
            tag: editing.tag,
            published: editing.published,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setNews((prev) => [data.item, ...prev])
          setEditing(null)
          setIsNew(false)
          startTransition(() => router.refresh())
        }
      } else {
        const res = await fetch("/api/admin/news", {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            patch: {
              title: editing.title,
              summary: editing.summary,
              content: editing.content,
              image: editing.image,
              date: editing.date,
              tag: editing.tag,
              published: editing.published,
            },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setNews((prev) => prev.map((n) => (n.id === editing.id ? data.item : n)))
          setEditing(null)
          startTransition(() => router.refresh())
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return
    const res = await fetch(`/api/admin/news?id=${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    })
    if (res.ok) {
      setNews((prev) => prev.filter((n) => n.id !== id))
      startTransition(() => router.refresh())
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {news.length} haber · Yayınlananlar sitede görünür
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/tr/haberler" target="_blank" rel="noreferrer">
              Siteyi aç
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              setEditing(emptyNews())
              setIsNew(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Yeni Haber
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {news.map((item) => (
          <Card key={item.id} className="overflow-hidden border-border/50 bg-white shadow-sm">
            <div
              className="h-36 bg-muted bg-cover bg-center"
              style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
            />
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {item.tag}
                </Badge>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    item.published
                      ? "bg-neutral-100 text-neutral-700"
                      : "bg-neutral-50 text-neutral-400"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      item.published ? "bg-neutral-800" : "bg-neutral-300"
                    )}
                  />
                  {item.published ? "Yayında" : "Taslak"}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 font-heading text-sm font-semibold text-lumia-dark">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{item.date}</p>
              <div className="mt-3 flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border/60 hover:bg-neutral-50 hover:text-lumia-dark"
                  onClick={() => {
                    setEditing({ ...item })
                    setIsNew(false)
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/tr/haberler/${item.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label="Sil"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? "Yeni Haber" : "Haberi Düzenle"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <ImageUpload
                label="Kapak görseli"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
                aspectClassName="aspect-[16/9]"
              />
              <div>
                <Label>Başlık</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Özet</Label>
                <Textarea
                  rows={2}
                  value={editing.summary}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                />
              </div>
              <div>
                <Label>Detay metni</Label>
                <Textarea
                  rows={6}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  placeholder="Paragrafları boş satırla ayırın"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tarih</Label>
                  <Input
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Etiket</Label>
                  <select
                    className="flex h-11 w-full rounded-2xl border border-input bg-white px-3 text-sm"
                    value={editing.tag}
                    onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                  >
                    {TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                Sitede yayınla
              </label>
              <Button
                variant="dark"
                className="w-full"
                onClick={save}
                disabled={
                  saving || !editing.title.trim() || !editing.summary.trim() || !editing.content.trim()
                }
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Kaydet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
