"use client"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts"
import { Prompt, AccesBloque } from "@/type"
import { useMemo } from "react"

interface ActivityChartProps {
  title?: string
  subtitle?: string
  prompts?: Prompt[]
  accesBlockes?: AccesBloque[]
}

export function ActivityChart({
  title = "Activité",
  subtitle = "Dernières 24 heures",
  prompts,
  accesBlockes,
}: ActivityChartProps) {
  
  // Générer les données pour le graphique des prompts (par score)
  const promptsData = useMemo(() => {
    if (!prompts) return []
    
    const scoreGroups = [
      { range: "0-2", count: 0, label: "Faible" },
      { range: "3-4", count: 0, label: "Modéré" },
      { range: "5-6", count: 0, label: "Élevé" },
      { range: "7-8", count: 0, label: "Critique" },
      { range: "9-10", count: 0, label: "Très critique" },
    ]
    
    prompts.forEach(prompt => {
      if (prompt.score <= 2) scoreGroups[0].count++
      else if (prompt.score <= 4) scoreGroups[1].count++
      else if (prompt.score <= 6) scoreGroups[2].count++
      else if (prompt.score <= 8) scoreGroups[3].count++
      else scoreGroups[4].count++
    })
    
    return scoreGroups
  }, [prompts])

  // Générer les données pour le graphique des accès bloqués (par URL)
  const accesData = useMemo(() => {
    if (!accesBlockes || accesBlockes.length === 0) {
      return []
    }
    
    // Grouper par URL et compter les tentatives
    const urlCounts: Record<string, number> = {}
    
    accesBlockes.forEach(acces => {
      urlCounts[acces.url] = (urlCounts[acces.url] || 0) + 1
    })
    
    // Convertir en tableau et trier par nombre de tentatives (décroissant)
    return Object.entries(urlCounts)
      .map(([url, count]) => ({
        url: url.length > 20 ? url.substring(0, 20) + '...' : url,
        count: count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Prendre les 10 sites les plus bloqués
  }, [accesBlockes])

  // Déterminer quel type de graphique afficher
  const isPromptsChart = !!prompts && !accesBlockes
  const data = isPromptsChart ? promptsData : accesData

  return (
    <Card className="group relative overflow-hidden border border-border bg-gradient-to-br from-card via-card to-card/80 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:ring-1 hover:ring-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative mb-6">
        <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="relative">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Aucune donnée disponible
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
          {isPromptsChart ? (
            <BarChart data={data}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.2)",
                }}
              />
              <Bar
                dataKey="count"
                fill="url(#colorBar)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="url"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.2)",
                }}
                labelFormatter={(label) => `Site: ${label}`}
                formatter={(value) => [`${value} tentatives`, 'Blocages']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--chart-2))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}