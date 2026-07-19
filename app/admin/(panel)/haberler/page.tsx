import { AdminPageHeader } from "@/components/admin/admin-shell"
import { NewsEditor } from "@/components/admin/news-editor"
import { getNewsItems } from "@/lib/admin-news-store"

export const dynamic = "force-dynamic"

export default function AdminHaberlerPage() {
  const news = getNewsItems()

  return (
    <>
      <AdminPageHeader
        title="Haberler"
        subtitle="Görsel, metin ve yayın durumu — sitede anında görünür"
      />
      <main className="p-4 sm:p-6">
        <NewsEditor initialNews={news} />
      </main>
    </>
  )
}
