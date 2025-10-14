import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const mockSites = [
  {
    id: 1,
    url: "malicious-site.com",
    redirection: "https://safe-page.com",
    date: "2024-01-15T08:00:00Z",
  },
  {
    id: 2,
    url: "phishing-example.net",
    redirection: "https://security-warning.com",
    date: "2024-01-14T14:30:00Z",
  },
  {
    id: 3,
    url: "dangerous-content.org",
    redirection: "https://blocked.com",
    date: "2024-01-13T11:20:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockSites)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newSite = {
    id: mockSites.length + 1,
    ...body,
    date: new Date().toISOString(),
  }
  mockSites.push(newSite)
  return NextResponse.json(newSite, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const index = mockSites.findIndex((s) => s.id === Number(id))
  if (index > -1) {
    mockSites.splice(index, 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
