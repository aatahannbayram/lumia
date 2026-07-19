"use client"

import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { Loader2, Pencil, Plus, Save, Trash2, UserRound } from "lucide-react"

import type { AdminStaffMember } from "@/lib/admin-staff-store"
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

interface StaffEditorProps {
  initialStaff: AdminStaffMember[]
}

const emptyMember = (): AdminStaffMember => ({
  id: "",
  name: "",
  role: "",
  photo: "",
  hoursStart: "09:00",
  hoursEnd: "20:00",
  active: true,
})

export function StaffEditor({ initialStaff }: StaffEditorProps) {
  const router = useRouter()
  const [staff, setStaff] = useState(initialStaff)
  const [editing, setEditing] = useState<AdminStaffMember | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(emptyMember())
    setIsNew(true)
  }

  async function saveMember() {
    if (!editing) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch("/api/admin/staff", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editing.name,
            role: editing.role,
            photo: editing.photo || "",
            hoursStart: editing.hoursStart,
            hoursEnd: editing.hoursEnd,
            active: editing.active,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setStaff((prev) => [...prev, data.member])
          setEditing(null)
          setIsNew(false)
          startTransition(() => router.refresh())
        }
      } else {
        const res = await fetch("/api/admin/staff", {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            patch: {
              name: editing.name,
              role: editing.role,
              photo: editing.photo || undefined,
              hoursStart: editing.hoursStart,
              hoursEnd: editing.hoursEnd,
              active: editing.active,
            },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setStaff((prev) => prev.map((m) => (m.id === editing.id ? data.member : m)))
          setEditing(null)
          startTransition(() => router.refresh())
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function removeMember(id: string) {
    if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) return
    const res = await fetch(`/api/admin/staff?id=${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    })
    if (res.ok) {
      setStaff((prev) => prev.filter((m) => m.id !== id))
      startTransition(() => router.refresh())
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="dark" size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          Personel Ekle
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="overflow-hidden border-border/60 bg-white shadow-soft">
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${member.photo})` }}
            />
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-semibold text-lumia-dark">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <Badge className={member.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}>
                  {member.active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {member.hoursStart} – {member.hoursEnd}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditing({ ...member })
                    setIsNew(false)
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5" />
              {isNew ? "Yeni Personel" : "Personel Düzenle"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Ad Soyad</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Uzmanlık / Rol</Label>
                <Input
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                />
              </div>
              <ImageUpload
                label="Fotoğraf"
                value={editing.photo}
                onChange={(url) => setEditing({ ...editing, photo: url })}
                aspectClassName="aspect-square max-h-56 mx-auto w-full max-w-[220px]"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Başlangıç</Label>
                  <Input
                    type="time"
                    value={editing.hoursStart}
                    onChange={(e) => setEditing({ ...editing, hoursStart: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bitiş</Label>
                  <Input
                    type="time"
                    value={editing.hoursEnd}
                    onChange={(e) => setEditing({ ...editing, hoursEnd: e.target.value })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                Aktif personel
              </label>
              <Button variant="dark" className="w-full" onClick={saveMember} disabled={saving}>
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
