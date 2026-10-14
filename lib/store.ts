import { promises as fs } from 'fs'
import path from 'path'

export interface PlayerScore {
  name: string
  score: number
  combo: number
}

export interface Worksheet {
  destacar: string
  ignorar: string
  steps: string[]
  updatedAt: number
}

export interface RoomState {
  index: number
  revealed: boolean
  votes: Record<string, Record<string, string>> // phaseId -> playerId -> choice
  scores: Record<string, PlayerScore> // playerId -> score
  characters: Record<string, string> // charId -> playerId (quem pegou)
  worksheets: Record<string, Worksheet> // playerId -> ficha da pesquisa (privada)
  deadline: number | null // epoch ms do fim do cronômetro da rodada
  token: string
  updatedAt: number
}

/** Arquivo local (funciona rodando na sua máquina). */
const FILE = path.join(process.cwd(), '.data', 'rooms.json')
const mem: Record<string, RoomState> = {}
let loaded = false

/** Upstash / Vercel KV via REST (funciona no Vercel). */
function upstash(): { url: string; token: string } | null {
  // Nomes conhecidos (preferidos).
  const known: Array<[string | undefined, string | undefined]> = [
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN],
  ]
  for (const [url, token] of known) if (url && token) return { url, token }

  // Varredura: qualquer variável que termine em REST_API_URL, com o token
  // correspondente (REST_API_TOKEN). Cobre nomes prefixados por integrações.
  for (const key of Object.keys(process.env)) {
    if (!/REST_API_URL$/.test(key)) continue
    const url = process.env[key]
    if (!url || !/^https?:\/\//.test(url)) continue
    const token = process.env[key.replace(/URL$/, 'TOKEN')]
    if (token) return { url, token }
  }
  return null
}

export function storageMode() {
  return upstash() ? 'upstash' : 'file'
}

async function fileLoad() {
  if (loaded) return
  loaded = true
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    Object.assign(mem, JSON.parse(raw))
  } catch {
    /* sem arquivo ainda */
  }
}

async function kvGet(key: string): Promise<RoomState | null> {
  const u = upstash()
  if (u) {
    try {
      const res = await fetch(`${u.url}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${u.token}` },
        cache: 'no-store',
      })
      if (!res.ok) return null
      const json = await res.json()
      if (json?.result == null) return null
      return typeof json.result === 'string' ? JSON.parse(json.result) : json.result
    } catch {
      return null
    }
  }
  await fileLoad()
  return mem[key] ?? null
}

async function kvSet(key: string, value: RoomState): Promise<void> {
  const u = upstash()
  if (u) {
    try {
      await fetch(`${u.url}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${u.token}` },
        body: JSON.stringify(value),
      })
    } catch {
      /* ignora */
    }
    return
  }
  await fileLoad()
  mem[key] = value
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true })
    await fs.writeFile(FILE, JSON.stringify(mem, null, 2))
  } catch {
    /* ignora */
  }
}

const keyOf = (code: string) => `oa:room:${code.toUpperCase()}`

export function genCode() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)]
  return s
}

export function genToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export async function getRoom(code: string): Promise<RoomState | null> {
  if (!code) return null
  return kvGet(keyOf(code))
}

export async function createRoom(code: string, token: string): Promise<RoomState> {
  const state: RoomState = {
    index: 0,
    revealed: false,
    votes: {},
    scores: {},
    characters: {},
    worksheets: {},
    deadline: null,
    token,
    updatedAt: Date.now(),
  }
  await kvSet(keyOf(code), state)
  return state
}

export async function setProgress(
  code: string,
  index: number,
  revealed: boolean,
  token: string,
  deadline: number | null,
): Promise<boolean> {
  const room = await getRoom(code)
  if (!room || room.token !== token) return false
  room.index = index
  room.revealed = revealed
  room.deadline = deadline
  room.scores = room.scores || {}
  room.updatedAt = Date.now()
  await kvSet(keyOf(code), room)
  return true
}

export async function setScore(
  code: string,
  playerId: string,
  name: string,
  score: number,
  combo: number,
): Promise<boolean> {
  const room = await getRoom(code)
  if (!room) return false
  room.scores = room.scores || {}
  room.scores[playerId] = { name, score, combo }
  room.updatedAt = Date.now()
  await kvSet(keyOf(code), room)
  return true
}

export async function claimCharacter(
  code: string,
  playerId: string,
  charId: string,
): Promise<{ ok: boolean; reason?: string }> {
  const room = await getRoom(code)
  if (!room) return { ok: false, reason: 'sala não existe' }
  room.characters = room.characters || {}
  const takenBy = room.characters[charId]
  if (takenBy && takenBy !== playerId) {
    return { ok: false, reason: 'já escolhido' }
  }
  // libera o anterior desse jogador, se houver
  for (const [cid, pid] of Object.entries(room.characters)) {
    if (pid === playerId) delete room.characters[cid]
  }
  room.characters[charId] = playerId
  room.updatedAt = Date.now()
  await kvSet(keyOf(code), room)
  return { ok: true }
}

export async function releaseCharacter(
  code: string,
  playerId: string,
): Promise<boolean> {
  const room = await getRoom(code)
  if (!room) return false
  room.characters = room.characters || {}
  for (const [cid, pid] of Object.entries(room.characters)) {
    if (pid === playerId) delete room.characters[cid]
  }
  room.updatedAt = Date.now()
  await kvSet(keyOf(code), room)
  return true
}

export async function recordVote(
  code: string,
  playerId: string,
  phaseId: string,
  choice: string,
): Promise<boolean> {
  const room = await getRoom(code)
  if (!room) return false
  room.votes[phaseId] = room.votes[phaseId] || {}
  room.votes[phaseId][playerId] = choice
  room.updatedAt = Date.now()
  await kvSet(keyOf(code), room)
  return true
}

export async function setWorksheet(
  code: string,
  playerId: string,
  data: { destacar: string; ignorar: string; steps: string[] },
): Promise<boolean> {
  const room = await getRoom(code)
  if (!room) return false
  room.worksheets = room.worksheets || {}
  room.worksheets[playerId] = { ...data, updatedAt: Date.now() }
  room.updatedAt = Date.now()
  await kvSet(keyOf(code), room)
  return true
}

export async function getWorksheet(code: string, playerId: string): Promise<Worksheet | null> {
  const room = await getRoom(code)
  if (!room) return null
  return room.worksheets?.[playerId] ?? null
}
