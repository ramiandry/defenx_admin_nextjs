"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { Prompt } from "@/type"

interface PromptDetailsDialogProps {
  prompt: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromptDetailsDialog({ prompt, open, onOpenChange }: PromptDetailsDialogProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  
  if (!prompt) return null

  // Fonction pour déterminer le niveau de risque basé sur le score
  const getRiskLevel = (score: number) => {
    if (score >= 7) return "critique"
    if (score >= 4) return "élevé"
    return "faible"
  }

  const riskLevel = getRiskLevel(prompt.score)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du Prompt</DialogTitle>
          <DialogDescription>Informations complètes sur le prompt utilisateur</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Utilisateur */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Utilisateur</label>
            <p className="mt-1 text-sm">{prompt.utilisateur}</p>
          </div>

          {/* Prompt Masqué avec bouton toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">
                {showOriginal ? "Prompt Original" : "Prompt Masqué"}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="h-8"
              >
                {showOriginal ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Masquer
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Afficher l'original
                  </>
                )}
              </Button>
            </div>
            <p className={`text-sm p-3 rounded-md ${
              showOriginal 
                ? 'bg-muted border border-border' 
                : 'bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800'
            }`}>
              {showOriginal ? prompt.prompt : prompt.prompt_masque}
            </p>
          </div>

          {/* Informations en grille */}
          <div className="grid grid-cols-2 gap-4">
            {/* Score */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Score de Risque</label>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-2xl font-bold ${
                  prompt.score >= 7 ? 'text-red-600' : 
                  prompt.score >= 4 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {prompt.score}
                </span>
                <span className="text-muted-foreground">/10</span>
              </div>
            </div>

            {/* Niveau de risque */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Niveau de risque</label>
              <div className="mt-1">
                <Badge
                  variant={
                    riskLevel === "critique" 
                      ? "destructive" 
                      : riskLevel === "élevé" 
                      ? "default" 
                      : "secondary"
                  }
                >
                  {riskLevel}
                </Badge>
              </div>
            </div>

            {/* Action */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Action</label>
              <div className="mt-1">
                <Badge variant={prompt.action === "bloque" ? "destructive" : "outline"}>
                  {prompt.action}
                </Badge>
              </div>
            </div>

            {/* Application */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Application</label>
              <p className="mt-1 text-sm">{prompt.app}</p>
            </div>

            {/* Date */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <p className="mt-1 text-sm">
                {new Date(prompt.date).toLocaleString('fr-FR', {
                  dateStyle: 'long',
                  timeStyle: 'medium'
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}