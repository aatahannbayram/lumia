import { AdminPageHeader } from "@/components/admin/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const coupons = [
  {
    code: "ACILIS10",
    label: "Açılış %10 İndirim",
    type: "Yüzde",
    value: "10%",
    status: "active",
  },
]

export default function IndirimlerPage() {
  return (
    <>
      <AdminPageHeader title="İndirimler & Kampanyalar" subtitle="Kupon ve promosyon yönetimi" />
      <main className="p-4 sm:p-6">
        <div className="space-y-3">
          {coupons.map((c) => (
            <Card key={c.code} className="border-border/50">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-heading font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground">
                    Kod: <span className="font-mono">{c.code}</span> · {c.type}: {c.value}
                  </p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Aktif</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
