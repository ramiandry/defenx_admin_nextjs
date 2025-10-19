"use client"

import { useSearchParams } from "next/navigation"
import { Shield, AlertTriangle, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function BlockedPage() {
  const searchParams = useSearchParams()
  const blockedUrl = searchParams.get("url") || "site-inconnu.com"
  const reason = searchParams.get("reason") || "Ce site a été identifié comme potentiellement dangereux"
  
  // Générer l'ID de blocage côté client uniquement
  const [blockId, setBlockId] = useState("")

  useEffect(() => {
    setBlockId(Date.now().toString(36).toUpperCase())
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 shadow-2xl">
        {/* Header avec logo */}
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2.5 shadow-lg shadow-blue-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold tracking-tight text-white">DefenX</span>
              <span className="text-xs text-zinc-400">Security System</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="mx-auto w-fit">
              <div className="rounded-full bg-red-950/50 p-4 ring-4 ring-red-900/30">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              Accès Bloqué
            </CardTitle>
            <CardDescription className="text-zinc-400 text-base">
              Ce site web a été bloqué par votre politique de sécurité
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* URL bloquée */}
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive" className="mt-0.5">
                Bloqué
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Site bloqué :</p>
                <code className="text-sm font-mono text-zinc-300 break-all">
                  {blockedUrl}
                </code>
              </div>
            </div>
          </div>

          {/* Raison du blocage */}
          <div className="rounded-lg bg-red-950/30 border border-red-900/50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-2">
                  RAISON DU BLOCAGE
                </h3>
                <p className="text-sm text-red-200/80 leading-relaxed">
                  {reason}
                </p>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
              <h3 className="text-sm font-semibold text-zinc-300">
                Que faire ?
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">•</span>
                <span>Vérifiez que l'URL est correcte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">•</span>
                <span>Contactez votre administrateur système si vous pensez qu'il s'agit d'une erreur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">•</span>
                <span>Consultez la politique de sécurité de votre organisation</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
           
            <Button
              asChild
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a href="mailto:admin@defenx.com">
                <Mail className="h-4 w-4 mr-2" />
                Contacter l'Admin
              </a>
            </Button>
          </div>

          {/* Footer info */}
          <div className="pt-6 border-t border-zinc-800">
            <p className="text-xs text-center text-zinc-500">
              Cette page est protégée par <span className="font-semibold text-blue-400">DefenX Security System</span>
              {blockId && (
                <>
                  <br />
                  ID de blocage : {blockId}
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}