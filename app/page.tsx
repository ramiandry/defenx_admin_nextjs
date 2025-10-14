"use client"

import { Sidebar } from "@/components/sidebar"
import { StatsCard } from "@/components/stats-card"
import { ActivityChart } from "@/components/activity-chart"
import { RecentPrompts } from "@/components/recent-prompts"
import { Shield, AlertTriangle, Ban, Key } from "lucide-react"
import { useFetchPrompts } from "@/hooks/useFetchPrompts"
import { useFetchKeywords } from "@/hooks/useFetchKeywords"
import { useFetchSites } from "@/hooks/useFetchSites"
import { useFetchAccesBloques } from "@/hooks/useFetchAccesBloques"

export default function DashboardPage() {
  const { prompts } = useFetchPrompts()
  const { keywords } = useFetchKeywords()
  const { sites } = useFetchSites()
  const { accesBlockes } = useFetchAccesBloques()

  // Calculer les statistiques basées sur les scores
  const scoreModere = prompts.filter(p => p.score >= 1 && p.score < 4).length
  const scoreEleve = prompts.filter(p => p.score >= 4 && p.score < 7).length
  const scoreCritique = prompts.filter(p => p.score >= 7).length

  // Nombre de mots-clés actifs
  const motsClésActifs = keywords.length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card">
          <div className="p-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble de la sécurité et des menaces</p>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Score Modéré" 
              value={scoreModere.toString()} 
              icon={Shield} 
              trend={`${prompts.length} total`}
              trendUp={false} 
            />
            <StatsCard
              title="Score Élevé"
              value={scoreEleve.toString()}
              icon={AlertTriangle}
              trend={`${Math.round((scoreEleve / prompts.length) * 100 || 0)}%`}
              trendUp={true}
              variant="warning"
            />
            <StatsCard 
              title="Score Critique" 
              value={scoreCritique.toString()} 
              icon={Ban} 
              trend={`${Math.round((scoreCritique / prompts.length) * 100 || 0)}%`}
              trendUp={scoreCritique > 0}
              variant="danger" 
            />
            <StatsCard 
              title="Mots Clés Actifs" 
              value={motsClésActifs.toString()} 
              icon={Key} 
              trend={`${keywords.filter(k => k.regex).length} avec regex`}
              trendUp={true} 
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivityChart 
              prompts={prompts}
              title="Activité des Prompts"
              subtitle="Distribution par score"
            />
            <ActivityChart 
              accesBlockes={accesBlockes}
              title="Accès Bloqués" 
              subtitle={`${accesBlockes.length} tentatives`}
            />
          </div>
          <RecentPrompts prompts={prompts} />
        </div>
      </main>
    </div>
  )
}