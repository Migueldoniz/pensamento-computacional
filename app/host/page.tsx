'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { PHASES, optionCounts, correctSoFar } from '@/lib/game'
import { getSnapshot, recordRoom, setProgress, PlayerScore } from '@/lib/client'
import { Robot, type Mood } from '@/components/Robot'
import { Timeline } from '@/components/Timeline'
import { useCountdown } from '@/lib/useCountdown'
import { initSound, isMuted, setMuted, sfxCorrect, sfxWrong, sfxStart, sfxTick, sfxClick } from '@/lib/sound'
import { CharAvatar } from '@/components/CharAvatar'
import { characterByName } from '@/lib/characters'

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
  const [scores, setScores] = useState<Record<string, PlayerScore>>({})
  const [deadline, setDeadline] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)
  const [origin, setOrigin] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [muted, setMutedState] = useState(false)

  useEffect(() => {
    initSound()
    setMutedState(isMuted())
    setOrigin(window.location.origin)
  }, [])

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
      setOffset(s.serverNow - Date.now())
      setIndex(s.index)
      setRevealed(s.revealed)
      setVotes(s.votes)
      setScores(s.scores || {})
      setDeadline(s.deadline ?? null)
      initialized.current = true
    })()
    return () => {
      alive = false
    }
  }, [room])

  useEffect(() => {
    if (!room || notFound) return
    const t = setInterval(async () => {
      const s = await getSnapshot(room)
      if (!s) return
      setVotes(s.votes)
      setScores(s.scores || {})
      setOffset(s.serverNow - Date.now())
    }, 1200)
    return () => clearInterval(t)
  }, [room, notFound])

  useEffect(() => {
    if (!room || !token || !initialized.current) return
    setProgress(room, index, revealed, token, deadline)
  }, [index, revealed, deadline, room, token])

  const countdown = useCountdown(deadline, offset)

  // Som nos últimos 3 segundos.
  const prevSec = useRef<number | null>(null)
  useEffect(() => {
    if (countdown == null) {
      prevSec.current = null
      return
    }
    if (countdown !== prevSec.current) {
      prevSec.current = countdown
      if (countdown > 0 && countdown <= 3) sfxTick()
    }
  }, [countdown])

  // Som ao revelar.
  const prevRevealed = useRef(false)
  useEffect(() => {
    if (revealed && !prevRevealed.current && phase.kind !== 'info') {
      if (hits >= Math.max(1, players / 2)) sfxCorrect()
      else sfxWrong()
    }
    prevRevealed.current = revealed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed])

  const phase = PHASES[index]
  const phaseVotes = votes[phase.id] || {}
  const counts = optionCounts(phaseVotes, phase)
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)
  const players = Object.keys(phaseVotes).length
  const hits = correctSoFar(phaseVotes, phase)

  const labelOf = (id: string) => phase.options?.find((o) => o.id === id)?.label ?? id

  const mood: Mood = phase.kind === 'info'
    ? 'idle'
    : revealed
      ? hits >= Math.max(1, players / 2)
        ? 'correct'
        : 'wrong'
      : 'thinking'

  const line = revealed
    ? hits >= Math.max(1, players / 2)
      ? phase.robotCorrect || 'Decisão correta.'
      : phase.robotWrong || 'Decisão incorreta.'
    : phase.robotThinking

  const joinUrl = origin && room ? `${origin}/play?room=${room}` : ''

  const ranking = Object.entries(scores)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 6)

  const go = (delta: number) => {
    setIndex((i) => Math.min(PHASES.length - 1, Math.max(0, i + delta)))
    setRevealed(false)
    setDeadline(null)
  }

  const startTimer = (seconds: number) => {
    setDeadline(Date.now() + offset + seconds * 1000)
    sfxStart()
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

  const timerClass = countdown == null ? '' : countdown <= 3 ? 'timer warn' : 'timer'

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
          <button
            className="ghost"
            onClick={() => {
              const m = !muted
              setMuted(m)
              setMutedState(m)
            }}
          >
            {muted ? '🔇 som' : '🔊 som'}
          </button>
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
                <QRCodeSVG value={joinUrl} size={120} />
              </div>
              <div className="mono big" style={{ letterSpacing: 4 }}>
                {room}
              </div>
            </div>
          )}

          {countdown != null && (
            <div className={timerClass}>
              <span>{countdown}</span>
              <small>segundos</small>
            </div>
          )}

          <div className="row" style={{ justifyContent: 'center' }}>
            <button onClick={() => go(-1)} disabled={index === 0}>◀</button>
            <button onClick={() => go(1)} disabled={index === PHASES.length - 1}>▶</button>
          </div>

          {phase.kind !== 'info' && (
            <>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button onClick={() => startTimer(15)}>⏱ 15s</button>
                <button onClick={() => startTimer(20)}>20s</button>
                <button onClick={() => startTimer(30)}>30s</button>
                <button className="ghost" onClick={() => setDeadline(null)} disabled={deadline == null}>
                  limpar
                </button>
              </div>
              <button className="primary" onClick={() => { sfxClick(); setRevealed((r) => !r) }}>
                {revealed ? 'esconder resposta' : 'revelar resposta'}
              </button>
            </>
          )}
        </div>

        <div className="card col">
          <div className="act">{phase.act}</div>
          <h2>{phase.title}</h2>
          <p>{phase.prompt}</p>

          {phase.timeline && <Timeline spec={phase.timeline} />}

          {phase.kind === 'single' || phase.kind === 'multi' ? (
            <div className="col" style={{ gap: 12 }}>
              {phase.options?.map((o) => {
                const c = counts[o.id] || 0
                const pct = totalVotes ? Math.round((c / totalVotes) * 100) : 0
                const isCorrect = revealed && (phase.correctIds || []).includes(o.id)
                return (
                  <div key={o.id} className="col" style={{ gap: 6 }}>
                    <div className="row spread">
                      <span style={{ fontSize: 17 }}>
                        {isCorrect ? '✅ ' : ''}
                        {o.label}
                      </span>
                      <span className="muted small">{c}</span>
                    </div>
                    <div className="bar">
                      <span style={{ width: `${pct}%`, background: isCorrect ? 'var(--ok)' : 'var(--accent)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : phase.kind === 'order' ? (
            <div className="col">
              <div className="small muted">{players} enviaram uma ordem</div>
              {revealed && (
                <div className="col" style={{ gap: 8 }}>
                  {phase.correctOrder?.map((id, i) => (
                    <div key={id} className="chip">
                      <b>{i + 1}</b> {labelOf(id)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="muted">
              {index === 0 ? 'Leia o desafio em voz alta e conduza.' : 'Fechamento: conecte com a próxima aula.'}
            </p>
          )}

          {revealed && phase.kind !== 'info' && (
            <div className="pill on">{hits}/{players} acertaram</div>
          )}

          {revealed && phase.explain && (
            <div className="bubble" style={{ borderColor: 'var(--ok)' }}>
              <strong>Por quê:</strong> {phase.explain}
            </div>
          )}

          {ranking.length > 0 && (
            <div className="col" style={{ marginTop: 8 }}>
              <div className="act">Ranking</div>
              <div className="col" style={{ gap: 6 }}>
                {ranking.map((r, i) => (
                  <div key={r.id} className="lb-row">
                    <span className="lb-pos">{['🥇', '🥈', '🥉'][i] || `${i + 1}º`}</span>
                    <CharAvatar c={characterByName(r.name)} size={22} />
                    <span className="lb-name">{r.name}</span>
                    <span className="lb-score">{r.score}</span>
                  </div>
                ))}
              </div>
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
              setDeadline(null)
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
