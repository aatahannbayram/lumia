"use client"

import { useCallback, useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
  aspectClassName?: string
}

export function ImageUpload({
  value,
  onChange,
  label = "Görsel",
  className,
  aspectClassName = "aspect-[16/10]",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Sadece görsel dosyaları yükleyebilirsiniz.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Dosya 5 MB’dan küçük olmalı.")
        return
      }

      setUploading(true)
      setError(null)
      try {
        const body = new FormData()
        body.append("file", file)
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          credentials: "same-origin",
          body,
        })
        if (!res.ok) {
          setError("Yükleme başarısız. Tekrar deneyin.")
          return
        }
        const data = (await res.json()) as { url: string }
        onChange(data.url)
      } catch {
        setError("Bağlantı hatası.")
      } finally {
        setUploading(false)
      }
    },
    [onChange]
  )

  function onFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) void upload(file)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium leading-none">{label}</p>}

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          onFiles(e.dataTransfer.files)
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed transition-colors",
          aspectClassName,
          dragging
            ? "border-lumia-dark bg-neutral-50"
            : "border-border/70 bg-neutral-50/80 hover:border-neutral-400 hover:bg-neutral-50",
          uploading && "pointer-events-none opacity-70"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-lumia-dark" />
              ) : (
                <Upload className="h-4 w-4 text-lumia-dark" />
              )}
            </span>
            <p className="text-sm font-medium text-lumia-dark">
              {uploading ? "Yükleniyor…" : "Sürükleyip bırakın veya seçin"}
            </p>
            <p className="text-[11px] text-muted-foreground">JPG, PNG, WEBP · max 5 MB</p>
          </div>
        )}

        {value && !uploading && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/55 to-transparent p-3 pt-8">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 bg-white/95 text-lumia-dark hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Değiştir
            </Button>
            <button
              type="button"
              aria-label="Görseli kaldır"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {uploading && value && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <Loader2 className="h-6 w-6 animate-spin text-lumia-dark" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
