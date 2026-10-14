import { NextResponse } from 'next/server'
import { getWorksheet, setWorksheet } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = (searchParams.get('code') || '').toUpperCase()
  const playerId = searchParams.get('playerId') || ''
  if (!code || !playerId) return NextResponse.json({ worksheet: null })
  const worksheet = await getWorksheet(code, playerId)
  return NextResponse.json({ worksheet })
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const code = String(b?.code || '').toUpperCase()
  const playerId = String(b?.playerId || '')
  if (!code || !playerId) return NextResponse.json({ ok: false }, { status: 400 })
  const steps = Array.isArray(b?.steps) ? b.steps.map((s: unknown) => String(s)).filter(Boolean) : []
  const ok = await setWorksheet(code, playerId, {
    destacar: String(b?.destacar || ''),
    ignorar: String(b?.ignorar || ''),
    steps,
  })
  return NextResponse.json({ ok })
}
