import { NextResponse } from 'next/server'
import { storageMode, wipeAllRooms } from '@/lib/store'

export const dynamic = 'force-dynamic'

/**
 * Apaga TODAS as salas (`oa:room:*`).
 * Exige a variável de ambiente `ADMIN_KEY` — sem ela, a rota fica desligada.
 *   POST /api/admin/wipe   { "key": "<ADMIN_KEY>" }
 * Também aceita `?key=` na URL (para abrir pelo navegador).
 */
async function handle(key: string) {
  const expected = process.env.ADMIN_KEY || ''
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'defina a variável ADMIN_KEY para habilitar esta rota' },
      { status: 501 },
    )
  }
  if (key !== expected) return NextResponse.json({ ok: false }, { status: 403 })

  const mode = storageMode()
  const removed = await wipeAllRooms()
  return NextResponse.json({ ok: true, mode, removed })
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}) as any)
  return handle(String(b?.key || ''))
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key') || ''
  return handle(key)
}
