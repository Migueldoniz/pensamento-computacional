import { NextResponse } from 'next/server'
import { claimCharacter, releaseCharacter } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const code = String(b?.code || '').toUpperCase()
  const playerId = String(b?.playerId || '')
  const charId = String(b?.charId || '')
  if (!code || !playerId || !charId) {
    return NextResponse.json({ ok: false, reason: 'parâmetros inválidos' }, { status: 400 })
  }
  const res = await claimCharacter(code, playerId, charId)
  return NextResponse.json(res)
}