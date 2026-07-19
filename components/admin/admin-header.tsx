"use client"

import Link from "next/link"
import { Bell, Calendar, LogOut, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { AdminNotification } from "@/lib/admin-notifications"

interface AdminHeaderProps {
  title: string
  subtitle?: string
  pendingCount?: number
  notifications?: AdminNotification[]
  onNewAppointment?: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function AdminHeader({
  title,
  subtitle,
  pendingCount = 0,
  notifications = [],
  onNewAppointment,
  searchValue,
  onSearchChange,
}: AdminHeaderProps) {
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 pl-10 lg:pl-0">
          <h1 className="font-heading text-xl font-bold text-lumia-dark sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:max-w-3xl lg:justify-end">
          {onSearchChange && (
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Müşteri, randevu, hizmet ara…"
                className="rounded-full pl-9"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative rounded-full bg-white p-2.5 shadow-soft outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-lumia-dark/20"
                  aria-label="Bildirimler"
                >
                  <Bell className="h-4 w-4 text-lumia-dark" />
                  {pendingCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(20rem,calc(100vw-2rem))]">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Bildirimler</span>
                  {pendingCount > 0 && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {pendingCount} yeni
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Yeni bildirim yok
                  </div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem key={n.id} asChild className="cursor-pointer p-0">
                      <Link
                        href={n.href}
                        className="flex w-full items-start gap-3 px-3 py-2.5"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lumia-cream">
                          <Calendar className="h-4 w-4 text-lumia-dark" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-lumia-dark">
                            {n.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {n.subtitle}
                          </span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/randevular" className="w-full justify-center text-sm font-medium">
                    Tüm randevuları gör
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-soft sm:flex">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-lumia-taupe text-xs text-white">LB</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xs font-semibold text-lumia-dark">Lumia Admin</p>
                <p className="text-[10px] text-muted-foreground">İşletme Sahibi</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={logout} aria-label="Çıkış">
              <LogOut className="h-4 w-4" />
            </Button>

            {onNewAppointment && (
              <Button variant="dark" onClick={onNewAppointment}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Yeni Randevu</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
