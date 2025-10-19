"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function LogoutButton() {
  const router = useRouter()
  const { logout, isLoading, user } = useAuth()

  const handleLogout = () => {
    // Clear authentication cookie
    logout()
    router.push("/login")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-white">
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  )
}
