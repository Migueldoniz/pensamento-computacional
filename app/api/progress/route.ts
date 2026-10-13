import { NextResponse } from 'next/server'
import { setProgress } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({} as any))
  const deadline =
    b?.deadline === null || b?.deadline === undefined ? null : Number(b.deadline)
  const ok = await setProgress(
    String(b?.code || '').toUpperCase(),
    Number(b?.index || 0),
    Boolean(b?.revealed),
    String(b?.token || ''),
    deadline,
  )
  return NextResponse.json({ ok })
}
