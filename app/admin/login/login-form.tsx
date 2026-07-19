"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Loader2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/admin"

  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ user, password }),
    })

    if (!res.ok) {
      setError("Kullanıcı adı veya şifre hatalı")
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lumia-cream via-background to-muted p-4">
      <Card className="w-full max-w-md border-border/60 shadow-soft-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-lumia-dark text-white">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle className="font-heading text-2xl">Lumia Admin</CardTitle>
          <CardDescription>Salon yönetim paneline giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="user">Kullanıcı adı</Label>
              <Input
                id="user"
                autoComplete="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="dark" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
