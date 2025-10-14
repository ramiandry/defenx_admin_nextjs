import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  variant?: "default" | "warning" | "danger"
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-border bg-gradient-to-br from-card via-card to-card/80 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl transition-all duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-4xl font-bold tracking-tight text-card-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                trendUp ? "text-chart-2" : "text-muted-foreground",
              )}
            >
              <span>{trendUp ? "↗" : "→"}</span>
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "rounded-2xl p-4 shadow-lg ring-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl",
            variant === "warning" &&
              "bg-gradient-to-br from-chart-3/20 to-chart-3/10 ring-chart-3/30 group-hover:shadow-chart-3/30",
            variant === "danger" &&
              "bg-gradient-to-br from-destructive/20 to-destructive/10 ring-destructive/30 group-hover:shadow-destructive/30",
            variant === "default" &&
              "bg-gradient-to-br from-primary/20 to-primary/10 ring-primary/30 group-hover:shadow-primary/30",
          )}
        >
          <Icon
            className={cn(
              "h-7 w-7 transition-transform duration-300 group-hover:scale-110",
              variant === "warning" && "text-chart-3",
              variant === "danger" && "text-destructive",
              variant === "default" && "text-primary",
            )}
          />
        </div>
      </div>
    </Card>
  )
}
