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
import { Rich } from '@/components/Rich'
import { SandwichArt, MapArt } from '@/components/Art'
import { ObjectiveIcon } from '@/components/ObjectiveIcon'
import { characterByName } from '@/lib/characters'

function fmtTime(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s)
}

function dedupeByName<T extends { name: string }>(rows: T[]): T[] {
  const seen = new Set<string>()
  return rows.filter((r) => {
    if (seen.has(r.name)) return false
    seen.add(r.name)
    return true
  })
}

function HostInner() {
  const params = useSearchParams()
  const router = useRouter()
  const codeParam = (params.get('room') || '').toUpperCase()

  const [room, setRoom] = useState(codeParam)
  const [token, setToken] = useState('')
  const [checked, setChecked] = useState(false)
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
  const [respostas, setRespostas] = useState<{ playerId: string; name: string; text: string }[]>([])

  useEffect(() => {
    initSound()
    setMutedState(isMuted())
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    if (codeParam) {
      setRoom(codeParam)
      let tok = ''
      try {
        tok = localStorage.getItem(`oa_host:${codeParam}`) || ''
      } catch {
        /* ignore */
      }
      setToken(tok)
      setChecked(true)
      return
    }
    let alive = true
    ;(async () => {
      const r = await recordRoom()
      if (!alive) return
      try {
        localStorage.setItem(`oa_host:${r.code}`, r.token)
      } catch {
        /* ignore */
      }
      router.replace(`/host?room=${r.code}`)
    })()
    return () => {
      alive = false
    }
  }, [codeParam, router])

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
      setRespostas(s.respostas || [])
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
      setRespostas(s.respostas || [])
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
  const flow = phase.flow
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

  const ranking = dedupeByName(
    Object.entries(scores)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
  ).slice(0, 5)

  const rankingAll = dedupeByName(
    Object.entries(scores)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
  )

  const go = (delta: number) => {
    setIndex((i) => Math.min(PHASES.length - 1, Math.max(0, i + delta)))
    setRevealed(false)
    setDeadline(null)
  }

  const startTimer = (seconds: number) => {
    setDeadline(Date.now() + offset + seconds * 1000)
    sfxStart()
  }

  const addTime = (seconds: number) => {
    setDeadline((d) => {
      const base = d ?? Date.now() + offset
      return Math.max(Date.now() + offset + 1000, base + seconds * 1000)
    })
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

  if (!checked) {
    return <div className="wrap">carregando…</div>
  }

  if (room && !token) {
    return (
      <div className="wrap">
        <h2>Sessão de apresentador não encontrada</h2>
        <p className="muted">
          Por segurança, o controle da sala fica apenas no navegador que a criou. Crie uma nova
          sala na <a href="/">página inicial</a>.
        </p>
      </div>
    )
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
          {phase.activity >= 3 && <span className="pill">{players} responderam</span>}
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

          <div className="row" style={{ justifyContent: 'center', gap: 6 }}>
            <button onClick={() => startTimer(30)}>30s</button>
            <button onClick={() => startTimer(60)}>1min</button>
            <button onClick={() => startTimer(180)}>3min</button>
            <button onClick={() => addTime(-30)} disabled={deadline == null}>−30s</button>
            <button onClick={() => addTime(30)}>+30s</button>
            <button className="ghost" onClick={() => setDeadline(null)} disabled={deadline == null}>
              limpar
            </button>
          </div>
        </div>

        <div className="card col" style={{ gap: 8 }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="act">{phase.act}</span>
            <h2 style={{ margin: 0, fontSize: 20 }}>{phase.title}</h2>
          </div>
          {phase.prompt && <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{phase.prompt}</p>}

          {phase.definition && <div className="quote">{phase.definition}</div>}

          {phase.kind === 'objetivos' && (
            <div className="col" style={{ gap: 10 }}>
              {flow ? (
                <div className="row" style={{ gap: 8 }}>
                  {flow.map((f, i) => (
                    <div key={i} className="row" style={{ gap: 8, alignItems: 'center' }}>
                      <div className="obj-tile">
                        {f.icon && <ObjectiveIcon name={f.icon} />}
                        <b>{f.label}</b>
                        {f.sub && <div className="small muted">{f.sub}</div>}
                      </div>
                      {i < flow.length - 1 && <span className="ccc-arrow">→</span>}
                    </div>
                  ))}
                </div>
              ) : phase.objectivesText ? (
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6 }}>
                  <Rich text={phase.objectivesText} />
                </p>
              ) : (
                phase.objectives?.map((o, i) => (
                  <div key={i} className="row spread" style={{ alignItems: 'center' }}>
                    <span>{o.text}</span>
                    <span className="pill on">{o.cell}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {phase.kind === 'conceito' && (
            <div className="col" style={{ gap: 16 }}>
              {phase.art === 'sandwich' && <SandwichArt />}
              {phase.art === 'map' && <MapArt />}
              {phase.contrast && (
                <div className="col" style={{ gap: 12 }}>
                  <div className="idea">
                    <div className="idea-tag">{phase.contrast.leftTitle}</div>
                    <div className="idea-big">{phase.contrast.leftText}</div>
                    {phase.contrast.leftNote && <div className="small muted">{phase.contrast.leftNote}</div>}
                  </div>
                  <div className="idea-arrow">↓</div>
                  <div className="idea">
                    <div className="idea-tag">{phase.contrast.rightTitle}</div>
                    <div className="idea-big mono">{phase.contrast.rightText}</div>
                    {phase.contrast.rightNote && <div className="small muted">{phase.contrast.rightNote}</div>}
                  </div>
                </div>
              )}
              {phase.concept?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span className="pill on" style={{ flex: 'none' }}>{i + 1}</span>
                  <div>
                    <b>{s.label}</b>
                    {s.detail && <div className="muted small">{s.detail}</div>}
                  </div>
                </div>
              ))}
              {phase.bullets && (
                <div className="row" style={{ gap: 8 }}>
                  {phase.bullets.map((b, i) => (
                    <span key={i} className="chip">{b}</span>
                  ))}
                </div>
              )}
              {phase.questions && (
                <div className="col" style={{ gap: 6 }}>
                  <div className="act">Perguntas-guia</div>
                  <ol className="big-list">
                    {phase.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}
              {phase.analogies && (
                <div className="col" style={{ gap: 8 }}>
                  <div className="act">Analogias</div>
                  {phase.analogies.map((a, i) => (
                    <div key={i} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22 }}>{a.icon}</span>
                      <div>
                        <b>{a.title}</b>
                        <div className="muted small">{a.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {phase.strategies && (
                <div className="col" style={{ gap: 8 }}>
                  <div className="act">Estratégias</div>
                  <ol className="big-list">
                    {phase.strategies.map((s, i) => (
                      <li key={i}>{s.name}</li>
                    ))}
                  </ol>
                </div>
              )}
              {phase.note && <div className="small muted">{phase.note}</div>}
            </div>
          )}

          {phase.kind === 'debrief' && (
            <div className="col" style={{ gap: 10 }}>
              <div className="col" style={{ gap: 8 }}>
                {phase.pillars?.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span className="pill on" style={{ flex: 'none' }}>{i + 1}</span>
                    <div>
                      <b>{p.name}</b>
                      {p.detail && <div className="muted small">{p.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {phase.quote && <div className="quote">{phase.quote}</div>}
              {phase.question && (
                <div className="bubble" style={{ borderColor: 'var(--accent)' }}>
                  <strong>Para pensar:</strong> {phase.question}
                </div>
              )}
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
            <div className="col" style={{ gap: 14 }}>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5 }}>{phase.research.prompt}</p>

              {respostas.length > 0 && (
                <div className="cards">
                  {respostas.map((r) => (
                    <div key={r.playerId} className="card-mini">
                      <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                        <CharAvatar c={characterByName(r.name)} size={22} />
                        <b>{r.name}</b>
                      </div>
                      <div style={{ marginTop: 6 }}>{r.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {phase.research.scaffold && (
                <div className="col" style={{ gap: 6 }}>
                  <div className="act">Passo a passo</div>
                  <ol className="steps">
                    {phase.research.scaffold.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}

              {phase.research.example && (
                <div className="model">
                  <div className="act">Exemplo de resposta</div>
                  <div className="model-body">
                    {phase.research.example.map((l, i) => (
                      <div key={i} className="model-row">
                        <span className="model-label">{l.label}</span>
                        <span>{l.value}</span>
                      </div>
                    ))}
                  </div>
                  {phase.research.exampleNote && (
                    <div className="small muted" style={{ marginTop: 8 }}>
                      {phase.research.exampleNote}
                    </div>
                  )}
                </div>
              )}

              {phase.research.sourceUrl && (
                <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                  <a
                    className="btn"
                    href={
                      phase.research.sourceUrl.startsWith('/') && room
                        ? `${phase.research.sourceUrl}?room=${room}`
                        : phase.research.sourceUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 {phase.research.sourceLabel || 'Abrir a fonte'}
                  </a>
                  {phase.research.template && (
                    <span className="mono small muted">{phase.research.template}</span>
                  )}
                </div>
              )}

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

          {phase.kind === 'premiacao' && (
            <div className="col" style={{ gap: 12 }}>
              <div className="act">Ranking final</div>
              <div className="col" style={{ gap: 6 }}>
                {rankingAll.length === 0 && <span className="muted small">Sem pontuações ainda.</span>}
                {rankingAll.map((r, i) => (
                  <div key={r.id} className="lb-row">
                    <span className="lb-pos">{['🥇', '🥈', '🥉'][i] || `${i + 1}º`}</span>
                    <CharAvatar c={characterByName(r.name)} size={24} />
                    <span className="lb-name">{r.name}</span>
                    <span className="lb-score">{r.score}</span>
                  </div>
                ))}
              </div>
              <div className="bubble" style={{ borderColor: 'var(--accent)' }}>{phase.prompt}</div>
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

          {ranking.length > 0 && phase.activity >= 3 && (
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
