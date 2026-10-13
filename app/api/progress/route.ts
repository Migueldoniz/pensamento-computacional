import { NextResponse } from 'next/server'
import { setProgress } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const ok = await setProgress(
    String(b?.code || '').toUpperCase(),
    Number(b?.index || 0),
    Boolean(b?.revealed),
    String(b?.token || ''),
  )
  return NextResponse.json({ ok })
}
