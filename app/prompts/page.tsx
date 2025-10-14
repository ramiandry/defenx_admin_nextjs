"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from "lucide-react"
import { AddPromptDialog } from "@/components/add-prompt-dialog"
import { PromptDetailsDialog } from "@/components/prompt-details-dialog"
import { useFetchPrompts } from "@/hooks/useFetchPrompts"
import { Prompt } from "@/type"

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  
  const { prompts, loading, error, refetch } = useFetchPrompts()

  // Fonction pour calculer le niveau de risque
  const getRiskLevel = (score: number) => {
    if (score >= 7) return "critique"
    if (score >= 4) return "élevé"
    return "faible"
  }

  // Filtre des prompts
  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.utilisateur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) 
  )

  const handleDetailsClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setDetailsOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Prompts</h1>
          <p className="text-muted-foreground">Gestion et surveillance des prompts utilisateurs</p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un prompt..."
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
          {/* <AddPromptDialog onAdd={refetch} /> */}
        </div>

        {/* Gestion du loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Chargement des prompts...</p>
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

        {/* Tableau des prompts */}
        {!loading && !error && (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Prompt</th>
                    {/* <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Score</th> */}
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Risque</th>
                    {/* <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Action</th> */}
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">App</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrompts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                        {searchQuery ? "Aucun résultat trouvé" : "Aucun prompt disponible"}
                      </td>
                    </tr>
                  ) : (
                    filteredPrompts.map((prompt) => {
                      const riskLevel = getRiskLevel(prompt.score)
                      return (
                        <tr key={prompt.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="px-6 py-4 text-sm text-card-foreground font-medium">
                            {prompt.utilisateur}
                          </td>
                          <td className="px-6 py-4 text-sm text-card-foreground max-w-md truncate">
                            {prompt.prompt_masque}
                          </td>
                          {/* <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${
                              prompt.score >= 7 ? 'text-red-600' : 
                              prompt.score >= 4 ? 'text-orange-600' : 
                              'text-green-600'
                            }`}>
                              {prompt.score}/10
                            </span>
                          </td> */}
                          <td className="px-6 py-4">
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
                          </td>
                          {/* <td className="px-6 py-4">
                            <Badge variant={prompt.action === "bloque" ? "destructive" : "outline"}>
                              {prompt.action}
                            </Badge>
                          </td> */}
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {prompt.app}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(prompt.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDetailsClick(prompt)}>
                              Détails
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <PromptDetailsDialog prompt={selectedPrompt} open={detailsOpen} onOpenChange={setDetailsOpen} />
      </main>
    </div>
  )
}