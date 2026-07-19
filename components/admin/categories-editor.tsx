"use client"

import { useState } from "react"
import { FolderTree, Loader2, Pencil, Save } from "lucide-react"

import type { AdminCategory } from "@/lib/admin-catalog-store"
import { CATEGORY_ICON_OPTIONS, CategoryIcon } from "@/lib/category-icons"
import { cn } from "@/lib/utils"
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

interface CategoriesEditorProps {
  initialCategories: AdminCategory[]
  serviceCounts: Record<string, number>
}

export function CategoriesEditor({ initialCategories, serviceCounts }: CategoriesEditorProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [saving, setSaving] = useState(false)

  async function saveCategory() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "category",
          id: editing.id,
          patch: { label: editing.label, emoji: editing.emoji, icon: editing.icon },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? data.category : c)))
        setEditing(null)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Card key={cat.id} className="border-border/60 bg-white shadow-soft">
            <CardContent className="flex items-center gap-4 p-6">
              <CategoryIcon categoryId={cat.id} icon={cat.icon} size="lg" />
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-lumia-dark">{cat.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {serviceCounts[cat.id] ?? 0} aktif hizmet
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing({ ...cat })}>
                <Pencil className="h-3.5 w-3.5" />
                Düzenle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Kategori Düzenle
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>İkon</Label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {CATEGORY_ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEditing({ ...editing, icon: opt.id })}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors",
                        editing.icon === opt.id
                          ? "border-lumia-dark bg-lumia-cream"
                          : "border-border/60 hover:border-lumia-dark/30"
                      )}
                    >
                      <CategoryIcon categoryId={editing.id} icon={opt.id} size="sm" />
                      <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Kategori Adı</Label>
                <Input
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                />
              </div>
              <Button variant="dark" className="w-full" onClick={saveCategory} disabled={saving}>
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
