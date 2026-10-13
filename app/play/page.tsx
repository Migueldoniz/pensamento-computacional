'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PHASES } from '@/lib/game'
import { getSnapshot, sendVote } from '@/lib/client'

function PlayerInner() {
  const params = useSearchParams()
  const room = (params.get('room') || '').toUpperCase()

  const [playerId, setPlayerId] = useState('')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [choice, setChoice] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const prevIndex = useRef(-1)

  useEffect(() => {
    let id = localStorage.getItem('oa_player')
    if (!id) {
      id = Math.random().toString(36).slice(2, 9)
      localStorage.setItem('oa_player', id)
    }
    setPlayerId(id)
  }, [])

  useEffect(() => {
    if (!room) return
    let alive = true
    const tick = async () => {
      const s = await getSnapshot(room)
      if (!alive) return
      if (!s) {
        setNotFound(true)
        return
      }
      if (s.index !== prevIndex.current) {
        prevIndex.current = s.index
        setChoice(null)
      }
      setIndex(s.index)
      setRevealed(s.revealed)
    }
    tick()
    const t = setInterval(tick, 1500)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [room])

  const phase = PHASES[index] || PHASES[0]

  if (!room) {
    return (
      <div className="wrap">
        <h2>Falta o código da sala</h2>
        <p className="muted">Volte e entre digitando o código de 4 letras.</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="wrap">
        <h2>Sala não encontrada</h2>
        <p className="muted">Confira o código com o apresentador.</p>
      </div>
    )
  }

  return (
    <div className="wrap col" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="row spread">
        <span className="act">Operação Agenda · plateia</span>
        <span className="pill">sala {room}</span>
      </div>

      <div className="card col">
        <div className="act">{phase.act}</div>
        <h2>{phase.title}</h2>
        <p>{phase.prompt}</p>

        {phase.options ? (
          <div className="col" style={{ gap: 12, marginTop: 8 }}>
            {phase.options.map((o) => {
              const selected = choice === o.id
              const showCorrect = revealed && o.id === phase.correctId
              const showWrong = revealed && selected && o.id !== phase.correctId
              const cls = ['opt', selected ? 'sel' : '', showCorrect ? 'correct' : '', showWrong ? 'wrong' : '']
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={o.id}
                  className={cls}
                  disabled={revealed}
                  onClick={() => {
                    setChoice(o.id)
                    sendVote(room, playerId || 'anon', phase.id, o.id)
                  }}
                >
                  <span>{o.label}</span>
                  <span>{selected ? '👉' : ''}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <p className="muted">Aguarde o apresentador.</p>
        )}

        {choice && !revealed && <p className="muted small">Resposta enviada. Olhe a tela do apresentador.</p>}
        {revealed && phase.explain && (
          <div className="bubble" style={{ borderColor: 'var(--ok)' }}>
            <strong>Por quê:</strong> {phase.explain}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="wrap">carregando…</div>}>
      <PlayerInner />
    </Suspense>
  )
}
