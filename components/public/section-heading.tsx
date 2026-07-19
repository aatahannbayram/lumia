import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "start" | "center"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center rounded-full bg-lumia-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lumia-coffee">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl font-heading text-3xl font-bold leading-tight text-lumia-dark sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
