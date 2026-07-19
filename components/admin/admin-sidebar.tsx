"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Menu, Plus, X } from "lucide-react"
import { useState } from "react"

import { useAdminShell } from "@/components/admin/admin-shell"
import { adminNav } from "@/lib/admin-nav"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { sidebarCollapsed, toggleSidebar } = useAdminShell()

  const navContent = (
    <>
      <div className={cn("flex items-start justify-between gap-2 px-4 py-6", sidebarCollapsed && "flex-col items-center px-2")}>
        <div className={cn(sidebarCollapsed && "text-center")}>
          <Link
            href="/admin"
            className={cn(
              "font-heading font-bold text-lumia-dark transition-all",
              sidebarCollapsed ? "text-lg" : "text-xl"
            )}
            title="Lumia Admin"
          >
            {sidebarCollapsed ? "L" : "Lumia"}
          </Link>
          {!sidebarCollapsed && (
            <p className="mt-0.5 text-xs font-medium text-lumia-coffee">Salon Yönetimi</p>
          )}
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden rounded-lg p-1.5 text-lumia-dark/60 transition-colors hover:bg-lumia-cream hover:text-lumia-dark lg:inline-flex"
          aria-label={sidebarCollapsed ? "Paneli genişlet" : "Paneli daralt"}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {adminNav.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={() => setMobileOpen(false)}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors",
                sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3",
                active
                  ? "bg-lumia-dark text-white shadow-md"
                  : "text-lumia-dark/70 hover:bg-lumia-cream hover:text-lumia-dark"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {!sidebarCollapsed && item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4">
        {sidebarCollapsed ? (
          <Button variant="dark" size="icon" className="mx-auto w-10" asChild title="Hizmet Ekle">
            <Link href="/admin/hizmetler" onClick={() => setMobileOpen(false)}>
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="dark" className="w-full" asChild>
            <Link href="/admin/hizmetler" onClick={() => setMobileOpen(false)}>
              <Plus className="h-4 w-4" />
              Hizmet Ekle
            </Link>
          </Button>
        )}
      </div>
    </>
  )

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-full bg-white p-2 shadow-soft lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Menüyü aç"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/60 bg-white transition-all duration-300 lg:static lg:shrink-0 lg:translate-x-0",
          sidebarCollapsed ? "w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0 shadow-soft-lg" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full p-1 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </aside>
    </>
  )
}
