import type { ReactNode } from "react"

interface DataTableProps {
  children: ReactNode
}

export function DataTable({ children }: DataTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}
