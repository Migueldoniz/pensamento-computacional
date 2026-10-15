// Apaga TODAS as salas (chaves `oa:room:*`).
//
//   npm run reset
//
// - Local: remove `.data/rooms.json` (pare o `npm run dev` antes!).
// - Upstash / Vercel KV: apaga as chaves `oa:room:*` via REST.
//   (usa UPSTASH_REDIS_REST_URL/TOKEN ou KV_REST_API_URL/TOKEN, de .env.local/.env)
import fs from 'node:fs'
import path from 'node:path'

// --- carrega .env.local / .env sem dependências ---
for (const f of ['.env.local', '.env']) {
  try {
    const txt = fs.readFileSync(f, 'utf8')
    for (const line of txt.split(/\r?\n/)) {
      const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line)
      if (!m) continue
      const key = m[1]
      const val = m[2].replace(/^["']|["']$/g, '')
      if (!(key in process.env)) process.env[key] = val
    }
  } catch {
    /* sem arquivo */
  }
}

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

// --- 1) arquivo local ---
const file = path.join(process.cwd(), '.data', 'rooms.json')
try {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  const n = Object.keys(data).length
  fs.rmSync(file)
  console.log(`🗑  ${n} sala(s) local(is) removida(s) — .data/rooms.json`)
  console.log('   ⚠  se o `npm run dev` estiver rodando, pare e inicie de novo (a memória ainda tem as salas).')
} catch {
  console.log('·  nenhum arquivo local de salas.')
}

// --- 2) Upstash / Vercel KV ---
if (!url || !token) {
  console.log('·  Upstash não configurado (nada a apagar no KV).')
  console.log(
    '   Para apagar as salas do Upstash, rode passando as credenciais:\n' +
      '     PowerShell:\n' +
      '       $env:UPSTASH_REDIS_REST_URL="https://....upstash.io"\n' +
      '       $env:UPSTASH_REDIS_REST_TOKEN="...."\n' +
      '       npm run reset\n' +
      '   (as credenciais estão no painel do Upstash ou nas env vars da Vercel)',
  )
  process.exit(0)
}

const headers = { Authorization: `Bearer ${token}` }
let cursor = '0'
let removed = 0
do {
  const res = await fetch(
    `${url}/scan/${cursor}?match=${encodeURIComponent('oa:room:*')}&count=100`,
    { headers, cache: 'no-store' },
  )
  if (!res.ok) {
    console.log(`✗  falha no SCAN do Upstash (${res.status}).`)
    process.exit(1)
  }
  const json = await res.json()
  cursor = String(json?.result?.[0] ?? '0')
  const keys = json?.result?.[1] ?? []
  for (const k of keys) {
    await fetch(`${url}/del/${encodeURIComponent(k)}`, { method: 'POST', headers })
    removed++
  }
} while (cursor !== '0')

console.log(removed ? `🗑  ${removed} sala(s) removida(s) do Upstash.` : '·  nenhuma sala no Upstash.')
