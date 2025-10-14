import { NextResponse } from "next/server"

export async function GET() {
  // Mock statistics - replace with actual database queries
  const stats = {
    score_modere: 145,
    score_eleve: 67,
    score_critique: 23,
    total_prompts: 235,
    sites_bloques: 89,
    acces_bloques: 156,
    mots_cles_actifs: 42,
  }

  return NextResponse.json(stats)
}
