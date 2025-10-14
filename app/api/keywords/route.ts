import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const mockKeywords = [
  {
    id: 1,
    keyword: "virus",
    regex: "\\b(virus|malware|trojan)\\b",
    active: true,
    date: "2024-01-10T10:00:00Z",
  },
  {
    id: 2,
    keyword: "hack",
    regex: "\\b(hack|exploit|breach)\\b",
    active: true,
    date: "2024-01-09T15:30:00Z",
  },
  {
    id: 3,
    keyword: "password",
    regex: "\\b(password|credentials|login)\\b",
    active: false,
    date: "2024-01-08T09:00:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockKeywords)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newKeyword = {
    id: mockKeywords.length + 1,
    ...body,
    date: new Date().toISOString(),
  }
  mockKeywords.push(newKeyword)
  return NextResponse.json(newKeyword, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const index = mockKeywords.findIndex((k) => k.id === Number(id))
  if (index > -1) {
    mockKeywords.splice(index, 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
