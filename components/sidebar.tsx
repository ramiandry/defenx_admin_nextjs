"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, FileText, Globe, Lock, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./logout-button"
import { ThemeToggle } from "./theme-toggle"

const navigation = [
  { name: "Dashboard", href: "/", icon: Shield },
  { name: "Prompts", href: "/prompts", icon: FileText },
  { name: "Sites Bloqués", href: "/sites", icon: Globe },
  { name: "Accès Bloqués", href: "/access", icon: Lock },
  { name: "Mots Clés", href: "/keywords", icon: Key },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="rounded-lg bg-primary p-2 shadow-sm">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">DefenX</span>
            <span className="text-xs text-muted-foreground">Security Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}
