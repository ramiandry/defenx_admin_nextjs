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
import { SiteBloque } from "@/type"

interface EditSiteDialogProps {
  site: SiteBloque | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditSiteDialog({ site, open, onOpenChange, onUpdate }: EditSiteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ site: "", redirection: "" })

  useEffect(() => {
    if (site) {
      setFormData({ site: site.site, redirection: site.redirection })
    }
  }, [site])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!site) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:7000/api/site_bloquer/${site.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: formData.site,
          redirection: formData.redirection,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        onUpdate()
      } else {
        console.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du site:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!site) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le site</DialogTitle>
            <DialogDescription>Mettre à jour les informations du site bloqué</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-site">Site à bloquer</Label>
              <Input
                id="edit-site"
                placeholder="exemple.com"
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Le domaine du site à bloquer (sans https://)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-redirection">URL de redirection (optionnel)</Label>
              <Input
                id="edit-redirection"
                placeholder="sitealternatif.com"
                value={formData.redirection}
                onChange={(e) => setFormData({ ...formData, redirection: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Laisser vide pour bloquer sans redirection
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