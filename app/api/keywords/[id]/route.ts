import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const id = params.id

  // In a real app, update the database here
  console.log(`[v0] Updating keyword ${id} with data:`, body)

  return NextResponse.json({ success: true, id, ...body })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // In a real app, delete from database here
  console.log(`[v0] Deleting keyword ${id}`)

  return NextResponse.json({ success: true })
}
