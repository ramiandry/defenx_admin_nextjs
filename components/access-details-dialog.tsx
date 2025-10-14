"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ShieldBan, Calendar, ExternalLink } from "lucide-react"
import { AccesBloque } from "@/type"

interface AccessDetailsDialogProps {
  log: AccesBloque | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessDetailsDialog({ log, open, onOpenChange }: AccessDetailsDialogProps) {
  if (!log) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Détails de l'accès bloqué</DialogTitle>
          <DialogDescription>Informations complètes sur la tentative d'accès</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* ID */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">ID de l'événement</label>
            <p className="mt-1 text-sm font-mono">#{log.id}</p>
          </div>

          {/* URL Bloquée */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">URL Bloquée</label>
            <div className="mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950 p-3 rounded-md border border-red-200 dark:border-red-800">
              <ShieldBan className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-mono font-medium">{log.url}</p>
            </div>
          </div>

          {/* Date et Heure */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date et heure</label>
            <div className="mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                {new Date(log.date).toLocaleString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Raison du blocage */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Raison du blocage</label>
            <div className="mt-2">
              <Badge variant="destructive" className="text-sm">
                Site bloqué par la politique de sécurité
              </Badge>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Cette tentative d'accès a été automatiquement bloquée par le système de sécurité Defenx. 
              L'utilisateur a été redirigé ou l'accès lui a été refusé selon la configuration.
            </p>
          </div>

          {/* Timestamp ISO (pour les développeurs) */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Informations techniques
            </summary>
            <div className="mt-2 space-y-1 font-mono text-muted-foreground bg-muted p-2 rounded">
              <p><strong>Timestamp ISO:</strong> {log.date}</p>
              <p><strong>Event ID:</strong> {log.id}</p>
              <p><strong>Blocked URL:</strong> {log.url}</p>
            </div>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  )
}