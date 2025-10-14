import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const mockPrompts = [
  {
    id: 1,
    user: "user@example.com",
    prompt: "Comment créer un virus informatique?",
    score: "critique",
    date: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    user: "admin@company.com",
    prompt: "Analyse de sécurité réseau",
    score: "modéré",
    date: "2024-01-15T09:15:00Z",
  },
  {
    id: 3,
    user: "test@test.com",
    prompt: "Accès aux données sensibles",
    score: "élevé",
    date: "2024-01-14T16:45:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockPrompts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newPrompt = {
    id: mockPrompts.length + 1,
    ...body,
    date: new Date().toISOString(),
  }
  mockPrompts.push(newPrompt)
  return NextResponse.json(newPrompt, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const index = mockPrompts.findIndex((p) => p.id === Number(id))
  if (index > -1) {
    mockPrompts.splice(index, 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
