import { NextResponse } from 'next/server'
import { recordVote } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const code = String(b?.code || '').toUpperCase()
  const playerId = String(b?.playerId || 'anon')
  const phaseId = String(b?.phaseId || '')
  const choice = String(b?.choice || '')
  if (!code || !phaseId || !choice) return NextResponse.json({ ok: false }, { status: 400 })
  const ok = await recordVote(code, playerId, phaseId, choice)
  return NextResponse.json({ ok })
}
