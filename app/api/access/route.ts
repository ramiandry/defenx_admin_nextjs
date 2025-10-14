import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const mockAccess = [
  {
    id: 1,
    user: "user@example.com",
    resource: "/admin/settings",
    reason: "Permissions insuffisantes",
    date: "2024-01-15T12:00:00Z",
  },
  {
    id: 2,
    user: "guest@test.com",
    resource: "/api/sensitive-data",
    reason: "Non authentifié",
    date: "2024-01-15T11:30:00Z",
  },
  {
    id: 3,
    user: "hacker@malicious.com",
    resource: "/database/export",
    reason: "Tentative d'intrusion",
    date: "2024-01-14T22:15:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockAccess)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newAccess = {
    id: mockAccess.length + 1,
    ...body,
    date: new Date().toISOString(),
  }
  mockAccess.push(newAccess)
  return NextResponse.json(newAccess, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const index = mockAccess.findIndex((a) => a.id === Number(id))
  if (index > -1) {
    mockAccess.splice(index, 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
