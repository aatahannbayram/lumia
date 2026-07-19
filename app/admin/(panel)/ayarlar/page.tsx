import { AdminPageHeader } from "@/components/admin/admin-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { site } from "@/lib/site-config"

export default function AyarlarPage() {
  return (
    <>
      <AdminPageHeader title="Ayarlar" subtitle="İşletme bilgileri ve site yapılandırması" />
      <main className="p-4 sm:p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle>İşletme Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/40 py-2">
              <span className="text-muted-foreground">Salon Adı</span>
              <span className="font-medium">{site.name}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 py-2">
              <span className="text-muted-foreground">E-posta</span>
              <span className="font-medium">{site.email}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 py-2">
              <span className="text-muted-foreground">Telefon</span>
              <span className="font-medium">{site.phoneDisplay}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 py-2">
              <span className="text-muted-foreground">WhatsApp</span>
              <span className="font-medium">{site.whatsapp}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Çalışma Saatleri</span>
              <span className="font-medium">09:00 – 20:00</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
