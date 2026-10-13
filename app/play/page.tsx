'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PHASES, encodeChoice, isCorrect } from '@/lib/game'
import { getSnapshot, sendVote } from '@/lib/client'
import { Timeline } from '@/components/Timeline'

interface Score {
  score: number
  combo: number
}

function loadScore(): Score {
  try {
    return JSON.parse(localStorage.getItem('oa_score') || '') as Score
  } catch {
    return { score: 0, combo: 0 }
  }
}
function saveScore(s: Score) {
  localStorage.setItem('oa_score', JSON.stringify(s))
}

function PlayerInner() {
  const params = useSearchParams()
  const room = (params.get('room') || '').toUpperCase()

  const [playerId, setPlayerId] = useState('')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [sent, setSent] = useState<string | null>(null)
  const [multi, setMulti] = useState<string[]>([])
  const [seq, setSeq] = useState<string[]>([])
  const [score, setScore] = useState<Score>({ score: 0, combo: 0 })

  const prevIndex = useRef(-1)
  const scored = useRef<Set<string>>(new Set())

  useEffect(() => {
    let id = localStorage.getItem('oa_player')
    if (!id) {
      id = Math.random().toString(36).slice(2, 9)
      localStorage.setItem('oa_player', id)
    }
    setPlayerId(id)
    setScore(loadScore())
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
        setSent(null)
        setMulti([])
        setSeq([])
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

  // Pontuação: conta uma vez por fase, quando revela.
  useEffect(() => {
    if (!revealed || phase.kind === 'info') return
    if (scored.current.has(phase.id)) return
    scored.current.add(phase.id)
    const good = isCorrect(phase, sent)
    const next: Score = {
      score: score.score + (good ? 10 : 0),
      combo: good ? score.combo + 1 : 0,
    }
    setScore(next)
    saveScore(next)
  }, [revealed, phase.id, phase.kind, sent, score.score, score.combo])

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

  const diff = sent !== null

  return (
    <div className="wrap col" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="row spread">
        <span className="act">Operação Agenda · plateia</span>
        <span className="row">
          <span className="pill">{score.score} pts{score.combo > 1 ? ` · combo ${score.combo}` : ''}</span>
          <span className="pill">sala {room}</span>
        </span>
      </div>

      <div className="card col">
        <div className="act">{phase.act}</div>
        <h2>{phase.title}</h2>
        <p>{phase.prompt}</p>

        {phase.timeline && <Timeline spec={phase.timeline} />}

        {phase.kind === 'single' && (
          <div className="col" style={{ gap: 12, marginTop: 8 }}>
            {phase.options?.map((o) => {
              const selected = sent === o.id
              const showCorrect = revealed && (phase.correctIds || []).includes(o.id)
              const showWrong = revealed && selected && !(phase.correctIds || []).includes(o.id)
              const cls = ['opt', selected ? 'sel' : '', showCorrect ? 'correct' : '', showWrong ? 'wrong' : '']
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={o.id}
                  className={cls}
                  disabled={revealed}
                  onClick={() => {
                    setSent(o.id)
                    sendVote(room, playerId || 'anon', phase.id, o.id)
                  }}
                >
                  <span>{o.label}</span>
                  <span>{selected ? '👉' : ''}</span>
                </button>
              )
            })}
          </div>
        )}

        {phase.kind === 'multi' && (
          <div className="col" style={{ gap: 12, marginTop: 8 }}>
            {phase.options?.map((o) => {
              const on = multi.includes(o.id)
              const missing = revealed && !multi.includes(o.id) && (phase.correctIds || []).includes(o.id)
              const extra = revealed && multi.includes(o.id) && !(phase.correctIds || []).includes(o.id)
              const cls = ['opt', on ? 'sel' : '', revealed && (phase.correctIds || []).includes(o.id) ? 'correct' : '', extra ? 'wrong' : '']
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={o.id}
                  className={cls}
                  disabled={revealed}
                  onClick={() => setMulti((m) => (m.includes(o.id) ? m.filter((x) => x !== o.id) : [...m, o.id]))}
                >
                  <span>{o.label}</span>
                  <span>{on ? '✅' : missing ? '＋' : ''}</span>
                </button>
              )
            })}
            <button
              className="primary"
              disabled={revealed || multi.length === 0}
              onClick={() => {
                const enc = encodeChoice('multi', multi)
                setSent(enc)
                sendVote(room, playerId || 'anon', phase.id, enc)
              }}
            >
              {diff ? 'reenviar seleção' : 'enviar seleção'}
            </button>
          </div>
        )}

        {phase.kind === 'order' && (
          <div className="col" style={{ gap: 12, marginTop: 8 }}>
            <div className="small muted">Toque na ordem correta — o número aparece à esquerda.</div>
            {phase.options?.map((o) => {
              const pos = seq.indexOf(o.id)
              const cls = ['opt', pos >= 0 ? 'sel' : ''].filter(Boolean).join(' ')
              return (
                <button
                  key={o.id}
                  className={cls}
                  disabled={revealed}
                  onClick={() => setSeq((s) => (s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id]))}
                >
                  <span>
                    {pos >= 0 ? `${pos + 1}. ` : ''}
                    {o.label}
                  </span>
                </button>
              )
            })}
            <button
              className="primary"
              disabled={revealed || seq.length !== (phase.options?.length || 0)}
              onClick={() => {
                const enc = encodeChoice('order', seq)
                setSent(enc)
                sendVote(room, playerId || 'anon', phase.id, enc)
              }}
            >
              {diff ? 'reenviar ordem' : 'enviar ordem'}
            </button>
          </div>
        )}

        {phase.kind === 'info' && <p className="muted">Aguarde o apresentador.</p>}

        {diff && !revealed && <p className="muted small">Resposta enviada. Olhe a tela do apresentador.</p>}
        {revealed && phase.kind !== 'info' && (
          <p className={isCorrect(phase, sent) ? 'pill on' : 'pill off'}>
            {isCorrect(phase, sent) ? 'Você acertou! +10' : 'Não foi dessa vez.'}
          </p>
        )}
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
