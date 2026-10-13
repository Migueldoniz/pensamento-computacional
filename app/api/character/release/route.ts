import { NextResponse } from 'next/server'
import { releaseCharacter } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const code = String(b?.code || '').toUpperCase()
  const playerId = String(b?.playerId || '')
  if (!code || !playerId) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  await releaseCharacter(code, playerId)
  return NextResponse.json({ ok: true })
}