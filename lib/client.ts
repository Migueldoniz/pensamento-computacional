export interface RoomSnapshot {
  index: number
  revealed: boolean
  votes: Record<string, Record<string, string>>
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
): Promise<void> {
  await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, index, revealed, token }),
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
