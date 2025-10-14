"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Key, Hash } from "lucide-react"
import { AddKeywordDialog } from "@/components/add-keyword-dialog"
import { EditKeywordDialog } from "@/components/edit-keyword-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { useFetchKeywords } from "@/hooks/useFetchKeywords"
import { MotCle } from "@/type"

export default function KeywordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKeyword, setSelectedKeyword] = useState<MotCle | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { keywords, loading, error, refetch } = useFetchKeywords()

  const filteredKeywords = keywords.filter(
    (keyword) =>
      keyword.mot_cles.toLowerCase().includes(searchQuery.toLowerCase()) ||
      keyword.regex.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditClick = (keyword: MotCle) => {
    setSelectedKeyword(keyword)
    setEditOpen(true)
  }

  const handleDeleteClick = (keyword: MotCle) => {
    setSelectedKeyword(keyword)
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedKeyword) return

    try {
      const response = await fetch(`http://localhost:7000/api/mot_cles/${selectedKeyword.id}`, {
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
          <h1 className="text-3xl font-semibold text-foreground mb-2">Mots Clés</h1>
          <p className="text-muted-foreground">Gestion des mots clés et patterns de détection</p>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-blue-500" />
              <p className="text-sm font-medium text-muted-foreground">Total de mots-clés</p>
            </div>
            <p className="text-3xl font-bold">{keywords.length}</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-muted-foreground">Avec regex</p>
            </div>
            <p className="text-3xl font-bold">
              {keywords.filter(k => k.regex).length}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-medium text-muted-foreground">Sans regex</p>
            </div>
            <p className="text-3xl font-bold">
              {keywords.filter(k => !k.regex).length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un mot clé..."
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
          <AddKeywordDialog onAdd={refetch} />
        </div>

        {/* Gestion du loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Chargement des mots-clés...</p>
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

        {/* Tableau des mots-clés */}
        {!loading && !error && (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Mot Clé</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Regex</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKeywords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        {searchQuery ? "Aucun résultat trouvé" : "Aucun mot-clé disponible"}
                      </td>
                    </tr>
                  ) : (
                    filteredKeywords.map((keyword) => (
                      <tr key={keyword.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                          #{keyword.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">{keyword.mot_cles}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {keyword.regex ? (
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {keyword.regex}
                            </code>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Aucun regex</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {keyword.regex ? (
                            <Badge variant="default">
                              <Hash className="h-3 w-3 mr-1" />
                              Pattern
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Mot simple
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(keyword)}>
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClick(keyword)}
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

        <EditKeywordDialog
          keyword={selectedKeyword}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdate={refetch}
        />
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
          title="Supprimer le mot clé"
          description={`Êtes-vous sûr de vouloir supprimer le mot clé "${selectedKeyword?.mot_cles}" ? Cette action est irréversible.`}
        />
      </main>
    </div>
  )
}