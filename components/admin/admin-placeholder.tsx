import { Construction } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface AdminPlaceholderProps {
  title: string
  description: string
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <Card className="border-dashed border-border/80">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Construction className="mb-4 h-10 w-10 text-lumia-taupe" />
        <h2 className="font-heading text-lg font-semibold text-lumia-dark">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
