import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function ArrowCircle({
  className,
  size = "default",
}: {
  className?: string
  size?: "sm" | "default" | "lg"
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-lumia-dark text-white transition-transform group-hover:rotate-45",
        size === "sm" && "h-8 w-8",
        size === "default" && "h-10 w-10",
        size === "lg" && "h-14 w-14",
        className
      )}
    >
      <ArrowUpRight className={cn(size === "lg" ? "h-6 w-6" : "h-4 w-4")} />
    </span>
  )
}
