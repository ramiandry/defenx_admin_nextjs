"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, ExternalLink, Ban } from "lucide-react"
import { AddSiteDialog } from "@/components/add-site-dialog"
import { EditSiteDialog } from "@/components/edit-site-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { useFetchSites} from "@/hooks/useFetchSites"
import { SiteBloque } from "@/type"

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSite, setSelectedSite] = useState<SiteBloque | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { sites, loading, error, refetch } = useFetchSites()

  const filteredSites = sites.filter(
    (site) =>
      site.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.redirection.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditClick = (site: SiteBloque) => {
    setSelectedSite(site)
    setEditOpen(true)
  }

  const handleDeleteClick = (site: SiteBloque) => {
    setSelectedSite(site)
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSite) return

    try {
      const response = await fetch(`http://localhost:7000/api/site_bloquer/${selectedSite.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        refetch()
        setDeleteOpen(false)
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Sites Bloqués</h1>
          <p className="text-muted-foreground">Gestion des sites web bloqués et redirections</p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un site..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <AddSiteDialog onAdd={refetch} />
        </div>

        {/* Gestion du loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Chargement des sites bloqués...</p>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-red-800">Erreur: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              className="mt-2"
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Tableau des sites */}
        {!loading && !error && (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Site Bloqué</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Redirection</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSites.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        {searchQuery ? "Aucun résultat trouvé" : "Aucun site bloqué"}
                      </td>
                    </tr>
                  ) : (
                    filteredSites.map((site) => (
                      <tr key={site.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                          #{site.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Ban className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-mono font-medium">{site.site}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {site.redirection ? (
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4 text-blue-500" />
                              <a 
                                href={`https://${site.redirection}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-blue-500 hover:underline"
                              >
                                {site.redirection}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              Aucune redirection
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={site.redirection ? "default" : "secondary"}>
                            {site.redirection ? "Avec redirection" : "Bloqué"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(site)}>
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClick(site)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <EditSiteDialog
          site={selectedSite}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdate={refetch}
        />
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
          title="Supprimer le site"
          description={`Êtes-vous sûr de vouloir supprimer le site "${selectedSite?.site}" ? Cette action est irréversible.`}
        />
      </main>
    </div>
  )
}