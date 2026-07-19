"use client"

import Link from "next/link"

import { quickActions } from "@/lib/admin-nav"
import { cn } from "@/lib/utils"

export function QuickActionCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {quickActions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-border/70 bg-white px-5 py-4 shadow-soft transition-all hover:shadow-soft-lg",
              action.accent
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lumia-dark text-white transition-transform group-hover:scale-105">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-semibold text-lumia-dark">{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
