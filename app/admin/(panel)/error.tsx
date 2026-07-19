"use client"

import { useEffect } from "react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[admin]", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-soft">
        <h2 className="font-heading text-xl font-bold text-lumia-dark">Panel yüklenemedi</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyin.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-lumia-dark px-6 py-2.5 text-sm font-medium text-white"
        >
          Yeniden dene
        </button>
      </div>
    </div>
  )
}
