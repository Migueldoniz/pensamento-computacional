'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { PHASES, tally } from '@/lib/game'
import { getSnapshot, recordRoom, setProgress } from '@/lib/client'
import { Robot, type Mood } from '@/components/Robot'

function HostInner() {
  const params = useSearchParams()
  const router = useRouter()
  const codeParam = (params.get('room') || '').toUpperCase()
  const tokenParam = params.get('token') || ''

  const [room, setRoom] = useState(codeParam)
  const [token, setToken] = useState(tokenParam)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [votes, setVotes] = useState<Record<string, Record<string, string>>>({})
  const [origin, setOrigin] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => setOrigin(window.location.origin), [])

  // Cria a sala se não houver código na URL.
  useEffect(() => {
    if (codeParam) {
      setRoom(codeParam)
      setToken(tokenParam)
      return
    }
    let alive = true
    ;(async () => {
      const r = await recordRoom()
      if (!alive) return
      router.replace(`/host?room=${r.code}&token=${r.token}`)
    })()
    return () => {
      alive = false
    }
  }, [codeParam, tokenParam, router])

  // Snapshot inicial (sincroniza após recarregar a página).
  const initialized = useRef(false)
  useEffect(() => {
    if (!room) return
    let alive = true
    ;(async () => {
      const s = await getSnapshot(room)
      if (!alive) return
      if (!s) {
        setNotFound(true)
        return
      }
      setIndex(s.index)
      setRevealed(s.revealed)
      setVotes(s.votes)
      initialized.current = true
    })()
    return () => {
      alive = false
    }
  }, [room])

  // Poll de votos.
  useEffect(() => {
    if (!room || notFound) return
    const t = setInterval(async () => {
      const s = await getSnapshot(room)
      if (s) setVotes(s.votes)
    }, 1200)
    return () => clearInterval(t)
  }, [room, notFound])

  // Envia o progresso (fase + revelado) para a sala.
  useEffect(() => {
    if (!room || !token || !initialized.current) return
    setProgress(room, index, revealed, token)
  }, [index, revealed, room, token])

  const phase = PHASES[index]
  const phaseVotes = votes[phase.id] || {}
  const counts = tally(phaseVotes, phase.options)
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)
  const players = Object.keys(phaseVotes).length

  const topId = phase.options
    ? [...phase.options].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))[0]?.id
    : undefined
  const majorityCorrect = Boolean(phase.correctId && topId === phase.correctId)

  const mood: Mood = !phase.options
    ? 'idle'
    : revealed
      ? majorityCorrect
        ? 'correct'
        : 'wrong'
      : 'thinking'

  const line = revealed
    ? majorityCorrect
      ? phase.robotCorrect || 'Decisão correta.'
      : phase.robotWrong || 'Decisão incorreta.'
    : phase.robotThinking

  const joinUrl = origin && room ? `${origin}/play?room=${room}` : ''

  const go = (delta: number) => {
    setIndex((i) => Math.min(PHASES.length - 1, Math.max(0, i + delta)))
    setRevealed(false)
  }

  if (notFound) {
    return (
      <div className="wrap">
        <h2>Sala não encontrada</h2>
        <p className="muted">
          Crie uma nova sala na <a href="/">página inicial</a>.
        </p>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="row spread" style={{ marginBottom: 16 }}>
        <div>
          <div className="act">Operação Agenda · apresentador</div>
          <h1 style={{ margin: 0 }}>Você é o Robô</h1>
        </div>
        <div className="row">
          <span className="pill">{players} responderam</span>
          <span className="pill">sala {room || '…'}</span>
        </div>
      </div>

      <div className="grid2">
        <div className="card col" style={{ alignItems: 'center' }}>
          <Robot mood={mood} />
          <div className="bubble" style={{ width: '100%', textAlign: 'center' }}>
            {line}
          </div>

          {joinUrl && (
            <div className="col" style={{ alignItems: 'center', gap: 6 }}>
              <div className="small muted">entre pela sua tela</div>
              <div style={{ background: '#fff', padding: 8, borderRadius: 12 }}>
                <QRCodeSVG value={joinUrl} size={132} />
              </div>
              <div className="mono big" style={{ letterSpacing: 4 }}>
                {room}
              </div>
            </div>
          )}

          <div className="row" style={{ justifyContent: 'center' }}>
            <button onClick={() => go(-1)} disabled={index === 0}>◀ anterior</button>
            <button onClick={() => go(1)} disabled={index === PHASES.length - 1}>próximo ▶</button>
          </div>
          {phase.options && (
            <button className="primary" onClick={() => setRevealed((r) => !r)}>
              {revealed ? 'esconder resposta' : 'revelar resposta'}
            </button>
          )}
        </div>

        <div className="card col">
          <div className="act">{phase.act}</div>
          <h2>{phase.title}</h2>
          <p>{phase.prompt}</p>

          {phase.options ? (
            <div className="col" style={{ gap: 12 }}>
              {phase.options.map((o) => {
                const c = counts[o.id] || 0
                const pct = totalVotes ? Math.round((c / totalVotes) * 100) : 0
                const isCorrect = revealed && o.id === phase.correctId
                return (
                  <div key={o.id} className="col" style={{ gap: 6 }}>
                    <div className="row spread">
                      <span style={{ fontSize: 17 }}>
                        {isCorrect ? '✅ ' : ''}
                        {o.label}
                      </span>
                      <span className="muted small">{c} · {pct}%</span>
                    </div>
                    <div className="bar">
                      <span style={{ width: `${pct}%`, background: isCorrect ? 'var(--ok)' : 'var(--accent)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="muted">
              Mostre o QR e conduza a conversa. Sem votação nesta tela.
            </p>
          )}

          {revealed && phase.explain && (
            <div className="bubble" style={{ borderColor: 'var(--ok)' }}>
              <strong>Por quê:</strong> {phase.explain}
            </div>
          )}
        </div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        {PHASES.map((p, i) => (
          <span
            key={p.id}
            className={`pill ${i === index ? 'on' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setIndex(i)
              setRevealed(false)
            }}
          >
            {p.act}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HostPage() {
  return (
    <Suspense fallback={<div className="wrap">carregando…</div>}>
      <HostInner />
    </Suspense>
  )
}
