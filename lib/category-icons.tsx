import type { LucideIcon } from "lucide-react"
import {
  Gem,
  Heart,
  Palette,
  Scissors,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react"

import { cn } from "@/lib/utils"

export const CATEGORY_ICON_OPTIONS = [
  { id: "scissors", label: "Makas", Icon: Scissors },
  { id: "sparkles", label: "Parlak", Icon: Sparkles },
  { id: "palette", label: "Palet", Icon: Palette },
  { id: "wand", label: "Sihir", Icon: Wand2 },
  { id: "gem", label: "Elmas", Icon: Gem },
  { id: "heart", label: "Kalp", Icon: Heart },
  { id: "star", label: "Yıldız", Icon: Star },
] as const

export type CategoryIconId = (typeof CATEGORY_ICON_OPTIONS)[number]["id"]

const iconMap: Record<CategoryIconId, LucideIcon> = {
  scissors: Scissors,
  sparkles: Sparkles,
  palette: Palette,
  wand: Wand2,
  gem: Gem,
  heart: Heart,
  star: Star,
}

const defaultByCategory: Record<string, CategoryIconId> = {
  hair: "scissors",
  nail: "sparkles",
}

const toneByCategory: Record<string, string> = {
  hair: "from-lumia-dark to-neutral-700",
  nail: "from-neutral-600 to-lumia-dark",
}

export function resolveCategoryIcon(categoryId: string, icon?: string | null): CategoryIconId {
  if (icon && icon in iconMap) return icon as CategoryIconId
  return defaultByCategory[categoryId] ?? "star"
}

interface CategoryIconProps {
  categoryId: string
  icon?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-xl [&_svg]:h-3.5 [&_svg]:w-3.5",
  md: "h-11 w-11 rounded-2xl [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-14 w-14 rounded-2xl [&_svg]:h-7 [&_svg]:w-7",
}

export function CategoryIcon({ categoryId, icon, size = "md", className }: CategoryIconProps) {
  const iconId = resolveCategoryIcon(categoryId, icon)
  const Icon = iconMap[iconId]
  const gradient = toneByCategory[categoryId] ?? "from-lumia-coffee to-lumia-dark"

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-gradient-to-br text-white shadow-soft",
        gradient,
        sizeClasses[size],
        className
      )}
    >
      <Icon strokeWidth={1.75} />
    </span>
  )
}
