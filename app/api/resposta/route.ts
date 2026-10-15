import { NextResponse } from 'next/server'
import { setResposta } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const code = String(b?.code || '').toUpperCase()
  const playerId = String(b?.playerId || '')
  const name = String(b?.name || 'Anônimo')
  const text = String(b?.text || '').slice(0, 400)
  if (!code || !playerId || !text.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const ok = await setResposta(code, playerId, name, text.trim())
  return NextResponse.json({ ok })
}
