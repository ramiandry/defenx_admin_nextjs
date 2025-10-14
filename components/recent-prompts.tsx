import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Prompt } from "@/type"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface RecentPromptsProps {
  prompts: Prompt[]
}

export function RecentPrompts({ prompts }: RecentPromptsProps) {
  // Fonction pour déterminer le niveau de risque
  const getRiskLevel = (score: number) => {
    if (score >= 7) return "critique"
    if (score >= 4) return "élevé"
    return "modéré"
  }

  // Prendre les 5 prompts les plus récents
  const recentPrompts = prompts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="group relative overflow-hidden border border-border bg-gradient-to-br from-card via-card to-card/80 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:ring-1 hover:ring-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative mb-6">
        <h3 className="text-lg font-bold text-card-foreground">Prompts Récents</h3>
        <p className="text-sm text-muted-foreground">Dernières activités détectées</p>
      </div>
      <div className="relative space-y-4">
        {recentPrompts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun prompt récent</p>
        ) : (
          recentPrompts.map((prompt) => {
            const risk = getRiskLevel(prompt.score)
            return (
              <div
                key={prompt.id}
                className="group/item flex items-start justify-between rounded-lg border-b border-border p-3 transition-all duration-200 last:border-0 hover:bg-muted/30 hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-card-foreground">
                      {prompt.utilisateur}
                    </span>
                    <Badge
                      variant={
                        risk === "critique" 
                          ? "destructive" 
                          : risk === "élevé" 
                          ? "default" 
                          : "secondary"
                      }
                      className="shadow-sm"
                    >
                      {risk}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Score: {prompt.score}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed truncate max-w-2xl">
                    {prompt.prompt_masque}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    App: {prompt.app}
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap ml-4">
                  {formatDistanceToNow(new Date(prompt.date), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}