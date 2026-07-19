"use client"

import Link from "next/link"
import { ArrowRight, Newspaper } from "lucide-react"

import type { AdminNewsItem } from "@/lib/admin-news-store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NewsPanel({ items }: { items: AdminNewsItem[] }) {
  const list = items.slice(0, 5)

  return (
    <Card className="border-border/50 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Newspaper className="h-4 w-4" strokeWidth={1.75} />
            Salon Haberleri
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">Güncel duyuru ve kampanyalar</p>
        </div>
        <Link
          href="/admin/haberler"
          className="inline-flex items-center gap-1 text-xs font-medium text-lumia-dark hover:underline"
        >
          Düzenle
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="max-h-[340px] space-y-2.5 overflow-y-auto">
        {list.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Henüz haber yok</p>
        ) : (
          list.map((item) => (
            <Link
              key={item.id}
              href={`/admin/haberler`}
              className="flex gap-3 rounded-xl border border-border/40 p-2 transition-colors hover:bg-muted/30"
            >
              <div
                className="h-14 w-16 shrink-0 rounded-lg bg-muted bg-cover bg-center"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {item.tag}
                  </Badge>
                  <time className="text-[10px] text-muted-foreground" dateTime={item.date}>
                    {item.date}
                  </time>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-lumia-dark">{item.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{item.summary}</p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
