import {
  BarChart3,
  Calendar,
  CalendarCheck,
  FolderTree,
  Gift,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Newspaper,
  Percent,
  RefreshCw,
  Scissors,
  Settings,
  Sparkles,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
  UserCog,
  Wallet,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"

export const adminNav: { href: string; label: string; icon: LucideIcon; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/randevular", label: "Randevular", icon: Calendar },
  { href: "/admin/hizmetler", label: "Hizmetler", icon: Scissors },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/musteriler", label: "Müşteriler", icon: Users },
  { href: "/admin/personel", label: "Personel", icon: UserCog },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquare },
  { href: "/admin/indirimler", label: "İndirimler", icon: Percent },
  { href: "/admin/analitik", label: "Analitik", icon: BarChart3 },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper },
  { href: "/admin/pazarlama", label: "WhatsApp", icon: Megaphone },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
]

export const quickActions = [
  {
    href: "/admin/indirimler",
    label: "İndirim Kodu Oluştur",
    icon: Tag,
    accent: "hover:border-blue-300 hover:bg-blue-50/50",
  },
  {
    href: "/admin/pazarlama",
    label: "WhatsApp Otomasyon",
    icon: MessageSquare,
    accent: "hover:border-emerald-300 hover:bg-emerald-50/50",
  },
  {
    href: "/admin/ayarlar",
    label: "Duyuru Banner'ı",
    icon: Sparkles,
    accent: "hover:border-amber-300 hover:bg-amber-50/50",
  },
  {
    href: "/admin/hizmetler",
    label: "Paket Teklif",
    icon: Gift,
    accent: "hover:border-violet-300 hover:bg-violet-50/50",
  },
] as const

export const statusLabels: Record<string, string> = {
  new: "Bekliyor",
  confirmed: "Onaylı",
  completed: "Tamamlandı",
  cancelled: "İptal",
  no_show: "Gelmedi",
}

export const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-900",
  confirmed: "bg-blue-100 text-blue-900",
  completed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-red-100 text-red-900",
  no_show: "bg-gray-100 text-gray-800",
}

export const kpiIcons: Record<string, LucideIcon> = {
  revenue: Wallet,
  appointments: CalendarCheck,
  average: TrendingUp,
  returning: RefreshCw,
  noshow: AlertTriangle,
  newRequests: UserPlus,
}
