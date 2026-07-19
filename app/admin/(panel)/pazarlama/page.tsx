import { AdminPageHeader } from "@/components/admin/admin-shell"
import { WhatsAppManager } from "@/components/admin/whatsapp-manager"
import {
  getWhatsAppAutomations,
  getWhatsAppLog,
  isWhatsAppConfigured,
} from "@/lib/whatsapp-automation"

export const dynamic = "force-dynamic"

export default function PazarlamaPage() {
  const automations = getWhatsAppAutomations()
  const log = getWhatsAppLog()
  const configured = isWhatsAppConfigured()

  return (
    <>
      <AdminPageHeader
        title="WhatsApp"
        subtitle="Otomasyon kuralları, şablonlar ve gönderim geçmişi"
      />
      <main className="p-4 sm:p-6">
        <WhatsAppManager
          initialAutomations={automations}
          initialLog={log}
          initialConfigured={configured}
        />
      </main>
    </>
  )
}
