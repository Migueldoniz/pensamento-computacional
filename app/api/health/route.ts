import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Diagnóstico de armazenamento.
 *  /api/health        → modo atual
 *  /api/health?deep=1 → testa SET/GET/DEL no Upstash e devolve os status (sem expor o token)
 */
export async function GET(req: Request) {
  const deep = new URL(req.url).searchParams.get('deep') === '1'

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || ''
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ''

  if (!url || !token) {
    return NextResponse.json({ mode: 'file', vercel: Boolean(process.env.VERCEL) })
  }

  const base = { mode: 'upstash', vercel: Boolean(process.env.VERCEL) }
  if (!deep) return NextResponse.json(base)

  // ---- teste real de escrita/leitura ----
  const clean = url.replace(/\/+$/, '')
  let host = 'invalida'
  try {
    host = new URL(clean).host
  } catch {
    /* ignore */
  }

  const headers = { Authorization: `Bearer ${token}` }
  const key = `oa:selftest:${Date.now()}`
  const out: Record<string, unknown> = {
    ...base,
    host,
    urlTemBarraFinal: url.endsWith('/'),
    urlComecaComHttps: clean.startsWith('https://'),
    tokenLen: token.length,
  }

  try {
    const setR = await fetch(`${clean}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers,
      body: 'ok',
      cache: 'no-store',
    })
    out.set = { status: setR.status, body: (await setR.text()).slice(0, 300) }

    const getR = await fetch(`${clean}/get/${encodeURIComponent(key)}`, { headers, cache: 'no-store' })
    out.get = { status: getR.status, body: (await getR.text()).slice(0, 300) }

    const colonKey = 'oa:room:TESTE'
    const setColon = await fetch(`${clean}/set/${encodeURIComponent(colonKey)}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ok: true }),
      cache: 'no-store',
    })
    out.setComDoisPontos = { status: setColon.status, body: (await setColon.text()).slice(0, 200) }
    const getColon = await fetch(`${clean}/get/${encodeURIComponent(colonKey)}`, { headers, cache: 'no-store' })
    out.getComDoisPontos = { status: getColon.status, body: (await getColon.text()).slice(0, 200) }

    await fetch(`${clean}/del/${encodeURIComponent(key)}`, { method: 'POST', headers })
    await fetch(`${clean}/del/${encodeURIComponent(colonKey)}`, { method: 'POST', headers })
  } catch (e) {
    out.error = String(e)
  }

  return NextResponse.json(out)
}
