export interface PlayerScore {
  name: string
  score: number
  combo: number
}

export interface RoomSnapshot {
  index: number
  revealed: boolean
  votes: Record<string, Record<string, string>>
  scores: Record<string, PlayerScore>
  characters: Record<string, string> // charId -> playerId
  players: number // total de participantes na sala
  respostas: { playerId: string; name: string; text: string }[]
  deadline: number | null
  serverNow: number
}

export async function recordRoom(code?: string): Promise<{ code: string; token: string }> {
  const r = await fetch('/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  return r.json()
}

export async function getSnapshot(code: string): Promise<RoomSnapshot | null> {
  const r = await fetch(`/api/room?code=${encodeURIComponent(code)}`, { cache: 'no-store' })
  if (!r.ok) return null
  return r.json()
}

export async function setProgress(
  code: string,
  index: number,
  revealed: boolean,
  token: string,
  deadline: number | null,
): Promise<void> {
  await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, index, revealed, token, deadline }),
  })
}

export async function sendVote(
  code: string,
  playerId: string,
  phaseId: string,
  choice: string,
): Promise<void> {
  await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, playerId, phaseId, choice }),
  })
}

export async function postScore(
  code: string,
  playerId: string,
  name: string,
  score: number,
  combo: number,
): Promise<void> {
  await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, playerId, name, score, combo }),
  })
}

export async function claimCharacter(
  code: string,
  playerId: string,
  charId: string,
): Promise<{ ok: boolean; reason?: string }> {
  const r = await fetch('/api/character/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, playerId, charId }),
  })
  return r.json()
}

export async function releaseCharacter(
  code: string,
  playerId: string,
): Promise<void> {
  await fetch('/api/character/release', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, playerId }),
  })
}

export async function saveResposta(
  code: string,
  playerId: string,
  name: string,
  text: string,
): Promise<void> {
  await fetch('/api/resposta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, playerId, name, text }),
  })
}

/** Zera os dados da sala (apresentador). */
export async function resetRoom(code: string, token: string): Promise<boolean> {
  const r = await fetch('/api/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, token }),
  })
  const j = await r.json().catch(() => ({}))
  return Boolean(j?.ok)
}
