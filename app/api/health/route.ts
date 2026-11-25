import { NextResponse } from 'next/server'
import { storageMode } from '@/lib/store'

export const dynamic = 'force-dynamic'

/** Diagnóstico: qual armazenamento está ativo. */
export async function GET() {
  return NextResponse.json({
    mode: storageMode(),
    vercel: Boolean(process.env.VERCEL),
  })
}
