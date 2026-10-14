'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { PHASES, optionCounts, correctSoFar, ACTIVITIES, isInteractive } from '@/lib/game'
import { getSnapshot, recordRoom, setProgress, PlayerScore } from '@/lib/client'
import { Robot, type Mood } from '@/components/Robot'
import { Timeline } from '@/components/Timeline'
import { useCountdown } from '@/lib/useCountdown'
import { initSound, isMuted, setMuted, sfxCorrect, sfxWrong, sfxStart, sfxTick, sfxClick } from '@/lib/sound'
import { CharAvatar } from '@/components/CharAvatar'
import { characterByName } from '@/lib/characters'

function fmtTime(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s)
}

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
  const [copied, setCopied] = useState(false)

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

  const phase = PHASES[index]
  const interactive = isInteractive(phase.kind)
  const phaseVotes = votes[phase.id] || {}
  const counts = optionCounts(phaseVotes, phase)
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)
  const players = Object.keys(phaseVotes).length
  const hits = correctSoFar(phaseVotes, phase)

  const prevRevealed = useRef(false)
  useEffect(() => {
    if (revealed && !prevRevealed.current && interactive) {
      if (hits >= Math.max(1, players / 2)) sfxCorrect()
      else sfxWrong()
    }
    prevRevealed.current = revealed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed])

  const labelOf = (id: string) => phase.options?.find((o) => o.id === id)?.label ?? id

  const majorityOk = hits >= Math.max(1, players / 2)
  const mood: Mood = !interactive ? 'idle' : revealed ? (majorityOk ? 'correct' : 'wrong') : 'thinking'
  const line = revealed
    ? majorityOk
      ? phase.robotCorrect || 'Decisão correta.'
      : phase.robotWrong || 'Decisão incorreta.'
    : phase.robotThinking

  const joinUrl = origin && room ? `${origin}/play?room=${room}` : ''

  const ranking = Object.entries(scores)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 5)

  const go = (delta: number) => {
    setIndex((i) => Math.min(PHASES.length - 1, Math.max(0, i + delta)))
    setRevealed(false)
    setDeadline(null)
  }

  const startTimer = (seconds: number) => {
    setDeadline(Date.now() + offset + seconds * 1000)
    sfxStart()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      sfxClick()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard bloqueado */
    }
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
      <div className="row spread" style={{ marginBottom: 10 }}>
        <div className="row" style={{ gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Você é o Robô</h1>
          <span className="pill on">Atividade {phase.activity}/5 · {ACTIVITIES[phase.activity]}</span>
          <span className="act">sala {room || '…'}</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="pill">{players} responderam</span>
          <button
            className="ghost"
            onClick={() => {
              const m = !muted
              setMuted(m)
              setMutedState(m)
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      <div className="grid2">
        <div className="card col" style={{ alignItems: 'center', gap: 10 }}>
          <Robot mood={mood} size={150} />
          <div className="bubble" style={{ width: '100%', textAlign: 'center', fontSize: 15, padding: '10px 12px' }}>
            {line}
          </div>

          {joinUrl && (
            <div className="row" style={{ gap: 10, width: '100%', flexWrap: 'nowrap' }}>
              <div style={{ background: '#fff', padding: 6, borderRadius: 10, flex: 'none' }}>
                <QRCodeSVG value={joinUrl} size={92} />
              </div>
              <div className="col" style={{ gap: 6, flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ letterSpacing: 3, fontSize: 22, fontWeight: 800 }}>
                  {room}
                </div>
                <button className="primary" onClick={copyLink} style={{ padding: '8px 10px' }}>
                  {copied ? '✅ copiado!' : '🔗 copiar link'}
                </button>
                <input
                  type="text"
                  readOnly
                  value={joinUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  style={{ fontSize: 10.5, textAlign: 'center' }}
                />
              </div>
            </div>
          )}

          {countdown != null && (
            <div className={timerClass} style={{ padding: '2px 14px' }}>
              <span style={{ fontSize: 26 }}>{fmtTime(countdown)}</span>
              <small>restantes</small>
            </div>
          )}

          <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
            <button onClick={() => go(-1)} disabled={index === 0}>◀</button>
            <button onClick={() => go(1)} disabled={index === PHASES.length - 1}>▶</button>
            {interactive && (
              <button className="primary" onClick={() => { sfxClick(); setRevealed((r) => !r) }}>
                {revealed ? 'esconder' : 'revelar'}
              </button>
            )}
          </div>

          {interactive && (
            <div className="row" style={{ justifyContent: 'center', gap: 6 }}>
              <button onClick={() => startTimer(15)}>⏱15s</button>
              <button onClick={() => startTimer(20)}>20s</button>
              <button onClick={() => startTimer(30)}>30s</button>
              <button className="ghost" onClick={() => setDeadline(null)} disabled={deadline == null}>
                limpar
              </button>
            </div>
          )}

          {phase.kind === 'pesquisa' && (
            <div className="row" style={{ justifyContent: 'center', gap: 6 }}>
              <button className="primary" onClick={() => startTimer((phase.research?.minutes || 3) * 60)}>
                ▶ iniciar {phase.research?.minutes || 3} min
              </button>
              <button className="ghost" onClick={() => setDeadline(null)} disabled={deadline == null}>
                limpar
              </button>
            </div>
          )}
        </div>

        <div className="card col" style={{ gap: 8 }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="act">{phase.act}</span>
            <h2 style={{ margin: 0, fontSize: 20 }}>{phase.title}</h2>
          </div>
          <p style={{ margin: 0 }}>{phase.prompt}</p>

          {phase.kind === 'objetivos' && (
            <div className="col" style={{ gap: 8 }}>
              {phase.objectives?.map((o, i) => (
                <div key={i} className="row spread" style={{ alignItems: 'center' }}>
                  <span>{o.text}</span>
                  <span className="pill on">{o.cell}</span>
                </div>
              ))}
            </div>
          )}

          {phase.kind === 'conceito' && (
            <div className="col" style={{ gap: 8 }}>
              {phase.concept?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span className="pill on" style={{ flex: 'none' }}>{i + 1}</span>
                  <div>
                    <b>{s.label}</b>
                    {s.detail && <div className="muted small">{s.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {phase.kind === 'regras' && (
            <div className="col" style={{ gap: 6 }}>
              {phase.rules?.map((r, i) => (
                <div key={i} className="row" style={{ gap: 8 }}>
                  <span className="pill on">{i + 1}</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {phase.kind === 'pesquisa' && phase.research && (
            <div className="col" style={{ gap: 8 }}>
              {phase.research.intro && <p style={{ margin: 0 }}>{phase.research.intro}</p>}
              <div className="bubble" style={{ borderColor: 'var(--warn)' }}>
                <div style={{ fontSize: 17 }}>{phase.research.prompt}</div>
              </div>
              {phase.research.sourceUrl && (
                <a
                  href={phase.research.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    textAlign: 'center',
                    background: 'var(--accent)',
                    color: '#05122c',
                    fontWeight: 700,
                    borderRadius: 12,
                    padding: '12px 16px',
                    textDecoration: 'none',
                  }}
                >
                  📄 {phase.research.sourceLabel || 'Abrir a fonte'}
                </a>
              )}
              {phase.research.excerpt && (
                <div className="small muted" style={{ borderLeft: '3px solid var(--line)', paddingLeft: 10 }}>
                  {phase.research.excerpt}
                </div>
              )}
              {phase.research.template && <div className="chip">{phase.research.template}</div>}
              {phase.research.hint && <div className="small muted">{phase.research.hint}</div>}
            </div>
          )}

          {phase.timeline && <Timeline spec={phase.timeline} />}

          {phase.kind === 'single' || phase.kind === 'multi' ? (
            <div className="col" style={{ gap: 8 }}>
              {phase.options?.map((o) => {
                const c = counts[o.id] || 0
                const denom = phase.kind === 'multi' ? players : totalVotes
                const pct = denom ? Math.round((c / denom) * 100) : 0
                const isCorrect = revealed && (phase.correctIds || []).includes(o.id)
                return (
                  <div key={o.id} className="col" style={{ gap: 4 }}>
                    <div className="row spread">
                      <span style={{ fontSize: 15 }}>
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
                <div className="col" style={{ gap: 6 }}>
                  {phase.correctOrder?.map((id, i) => (
                    <div key={id} className="chip">
                      <b>{i + 1}</b> {labelOf(id)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {revealed && interactive && (
            <div className="pill on">{hits}/{players} acertaram</div>
          )}

          {revealed && phase.explain && (
            <div className="bubble" style={{ borderColor: 'var(--ok)', fontSize: 14, padding: '10px 12px' }}>
              <strong>Por quê:</strong> {phase.explain}
            </div>
          )}

          {phase.kind === 'info' && !phase.explain && (
            <p className="muted" style={{ margin: 0 }}>
              {phase.id === 'boot' ? 'Leia a missão e aguarde a turma entrar.' : 'Fechamento: conecte com a próxima aula.'}
            </p>
          )}

          {phase.sources && (
            <div className="small muted" style={{ marginTop: 4 }}>
              <strong>Fontes:</strong> {phase.sources.join(' · ')}
            </div>
          )}

          {ranking.length > 0 && (
            <div className="col" style={{ gap: 4 }}>
              <div className="act">Ranking</div>
              {ranking.map((r, i) => (
                <div key={r.id} className="lb-row" style={{ fontSize: 14 }}>
                  <span className="lb-pos">{['🥇', '🥈', '🥉'][i] || `${i + 1}º`}</span>
                  <CharAvatar c={characterByName(r.name)} size={20} />
                  <span className="lb-name">{r.name}</span>
                  <span className="lb-score">{r.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="row" style={{ marginTop: 10, gap: 6 }}>
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
