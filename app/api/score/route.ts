import { NextResponse } from 'next/server'
import { setScore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const code = String(b?.code || '').toUpperCase()
  const playerId = String(b?.playerId || '')
  if (!code || !playerId) return NextResponse.json({ ok: false }, { status: 400 })
  const ok = await setScore(
    code,
    playerId,
    String(b?.name || 'Anônimo'),
    Number(b?.score || 0),
    Number(b?.combo || 0),
  )
  return NextResponse.json({ ok })
}
