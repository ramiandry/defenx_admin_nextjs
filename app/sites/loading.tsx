import { Sidebar } from "@/components/sidebar"
import { TableSkeleton } from "@/components/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-40" />
        </div>

        <TableSkeleton rows={5} columns={5} />
      </main>
    </div>
  )
}
