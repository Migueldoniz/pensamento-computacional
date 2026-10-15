import { NextResponse } from 'next/server'
import { createRoom, genCode, genToken, getRoom } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any))
  const code = String(body?.code || genCode()).toUpperCase().slice(0, 8)
  const existing = await getRoom(code)
  if (existing) return NextResponse.json({ code, token: existing.token })
  const token = genToken()
  await createRoom(code, token)
  return NextResponse.json({ code, token })
}

export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get('code') || '').toUpperCase()
  const room = await getRoom(code)
  if (!room) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({
    index: room.index,
    revealed: room.revealed,
    votes: room.votes,
    scores: room.scores || {},
    characters: room.characters || {},
    players: Object.keys(room.characters || {}).length,
    respostas: Object.entries(room.respostas || {}).map(([playerId, r]) => ({
      playerId,
      name: r.name,
      text: r.text,
    })),
    deadline: room.deadline ?? null,
    serverNow: Date.now(),
  })
}
