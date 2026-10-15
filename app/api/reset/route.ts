import { NextResponse } from 'next/server'
import { resetRoom } from '@/lib/store'

export const dynamic = 'force-dynamic'

/** Zera os dados de UMA sala (exige o token do apresentador). */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}) as any)
  const code = String(b?.code || '').toUpperCase()
  const token = String(b?.token || '')
  if (!code || !token) return NextResponse.json({ ok: false }, { status: 400 })
  const ok = await resetRoom(code, token)
  return NextResponse.json({ ok }, { status: ok ? 200 : 403 })
}
