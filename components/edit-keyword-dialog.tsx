"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MotCle } from "@/type"

interface EditKeywordDialogProps {
  keyword: MotCle | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditKeywordDialog({ keyword, open, onOpenChange, onUpdate }: EditKeywordDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ mot_cles: "", regex: "" })

  useEffect(() => {
    if (keyword) {
      setFormData({ mot_cles: keyword.mot_cles, regex: keyword.regex })
    }
  }, [keyword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:7000/api/mot_cles/${keyword.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mot_cles: formData.mot_cles,
          regex: formData.regex,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        onUpdate()
      } else {
        console.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot-clé:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!keyword) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le mot clé</DialogTitle>
            <DialogDescription>Mettre à jour les informations du mot clé</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-mot-cles">Mot clé</Label>
              <Input
                id="edit-mot-cles"
                placeholder="Defenx"
                value={formData.mot_cles}
                onChange={(e) => setFormData({ ...formData, mot_cles: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Le mot ou l'expression à détecter
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-regex">Expression régulière (optionnel)</Label>
              <Input
                id="edit-regex"
                placeholder="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                value={formData.regex}
                onChange={(e) => setFormData({ ...formData, regex: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Laisser vide pour une détection simple du mot-clé. Utiliser une regex pour des patterns complexes.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}