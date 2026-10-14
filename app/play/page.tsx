'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PHASES, encodeChoice, isCorrect, ACTIVITIES, isInteractive } from '@/lib/game'
import { getSnapshot, sendVote, postScore, claimCharacter, releaseCharacter, saveWorksheet, getWorksheet, PlayerScore } from '@/lib/client'
import { Timeline } from '@/components/Timeline'
import { CHARACTERS, characterById } from '@/lib/characters'
import { CharAvatar } from '@/components/CharAvatar'
import { useCountdown } from '@/lib/useCountdown'
import { initSound, isMuted, setMuted, sfxCorrect, sfxWrong, sfxTick, sfxClick, sfxWin } from '@/lib/sound'

interface Score {
  score: number
  combo: number
}

function loadScore(room: string): Score {
  try {
    return JSON.parse(localStorage.getItem(`oa_score:${room}`) || '') as Score
  } catch {
    return { score: 0, combo: 0 }
  }
}
function saveScore(room: string, s: Score) {
  localStorage.setItem(`oa_score:${room}`, JSON.stringify(s))
}

function fmtTime(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s)
}

function PlayerInner() {
  const params = useSearchParams()
  const room = (params.get('room') || '').toUpperCase()

  const [playerId, setPlayerId] = useState('')
  const [charId, setCharId] = useState('')
  const [ready, setReady] = useState(false)
  const [muted, setMutedState] = useState(false)

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)
  const [scores, setScores] = useState<Record<string, PlayerScore>>({})
  const [takenChars, setTakenChars] = useState<Record<string, string>>({})

  const [sent, setSent] = useState<string | null>(null)
  const [multi, setMulti] = useState<string[]>([])
  const [seq, setSeq] = useState<string[]>([])
  const [score, setScore] = useState<Score>({ score: 0, combo: 0 })

  // Ficha da pesquisa (worksheet) — privada por aluno
  const [wcDecisao, setWcDecisao] = useState('')
  const [wcDestacar, setWcDestacar] = useState('')
  const [wcIgnorar, setWcIgnorar] = useState('')
  const [wcStep, setWcStep] = useState('')
  const [wcSteps, setWcSteps] = useState<string[]>([])
  const [wcSaved, setWcSaved] = useState(false)
  const wcLoaded = useRef(false)

  const prevIndex = useRef(-1)
  const prevRevealed = useRef(false)
  const prevSec = useRef<number | null>(null)
  const scored = useRef<Set<string>>(new Set())

  useEffect(() => {
    initSound()
    setMutedState(isMuted())
    let id = localStorage.getItem('oa_player')
    if (!id) {
      id = Math.random().toString(36).slice(2, 9)
      localStorage.setItem('oa_player', id)
    }
    setPlayerId(id)
    const savedName = localStorage.getItem('oa_name') || ''
    if (savedName) {
      setCharId(savedName)
      setReady(true)
    }
  }, [])

  // Pontuação e fases já pontuadas isoladas POR SALA.
  useEffect(() => {
    if (!room) return
    setScore(loadScore(room))
    try {
      scored.current = new Set(JSON.parse(localStorage.getItem(`oa_scored:${room}`) || '[]'))
    } catch {
      scored.current = new Set()
    }
  }, [room])

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
      setDeadline(s.deadline ?? null)
      setScores(s.scores || {})
      setTakenChars(s.characters || {})
      setOffset(s.serverNow - Date.now())
    }
    tick()
    const t = setInterval(tick, 1500)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [room])

  const phase = PHASES[index] || PHASES[0]
  const char = characterById(charId)
  const name = char?.name || 'Anônimo'
  const countdown = useCountdown(deadline, offset)
  const locked = revealed || (countdown !== null && countdown <= 0)

  useEffect(() => {
    if (!revealed || !isInteractive(phase.kind)) return
    if (scored.current.has(phase.id)) return
    scored.current.add(phase.id)
    try {
      localStorage.setItem(`oa_scored:${room}`, JSON.stringify([...scored.current]))
    } catch {
      /* ignore */
    }
    const good = isCorrect(phase, sent)
    const next: Score = {
      score: score.score + (good ? 10 : 0),
      combo: good ? score.combo + 1 : 0,
    }
    setScore(next)
    saveScore(room, next)
    if (good) sfxCorrect()
    else sfxWrong()
    if (room && playerId) postScore(room, playerId, name, next.score, next.combo)
  }, [revealed, phase.id, phase.kind, sent, score.score, score.combo, room, playerId, name])

  // Carrega a ficha da pesquisa (uma vez) — apenas a do próprio aluno.
  useEffect(() => {
    if (!room || !playerId || wcLoaded.current) return
    wcLoaded.current = true
    ;(async () => {
      const w = await getWorksheet(room, playerId)
      if (w) {
        setWcDecisao(w.decisao || '')
        setWcDestacar(w.destacar)
        setWcIgnorar(w.ignorar)
        setWcSteps(w.steps || [])
        setWcSaved(true)
      }
    })()
  }, [room, playerId])

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

  const myRank = Object.entries(scores)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.score - a.score)
    .findIndex((r) => r.id === playerId)

  async function pickCharacter(id: string) {
    if (!room || !playerId) return
    const res = await claimCharacter(room, playerId, id)
    if (!res.ok) {
      return
    }
    localStorage.setItem('oa_name', id)
    setCharId(id)
    setReady(true)
    sfxClick()
    if (room && playerId) postScore(room, playerId, characterById(id)?.name || 'Anônimo', score.score, score.combo)
  }

  function addStep() {
    const v = wcStep.trim()
    if (!v) return
    setWcSteps((s) => [...s, v])
    setWcStep('')
    sfxClick()
  }
  function removeStep(i: number) {
    setWcSteps((s) => s.filter((_, k) => k !== i))
  }
  async function saveWs() {
    if (!room || !playerId) return
    await saveWorksheet(room, playerId, {
      decisao: wcDecisao.trim(),
      destacar: wcDestacar.trim(),
      ignorar: wcIgnorar.trim(),
      steps: wcSteps,
    })
    setWcSaved(true)
    sfxClick()
  }

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

  if (!ready) {
    const available = CHARACTERS.filter((c) => {
      const takenBy = takenChars[c.id]
      return !takenBy || takenBy === playerId
    })
    return (
      <div className="wrap col" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div>
          <div className="act">Operação Agenda · sala {room}</div>
          <h1 style={{ marginBottom: 4 }}>Escolha seu personagem</h1>
          <p className="muted" style={{ margin: '0 0 8px' }}>
            Ele será o seu nickname no jogo. Personagens já escolhidos somem da lista.
          </p>
        </div>
        <div className="chars">
          {available.map((c) => (
            <button key={c.id} className="char" onClick={() => pickCharacter(c.id)}>
              <CharAvatar c={c} size={56} />
              <span className="char-text">
                <b>{c.name}</b>
                <small className="muted">({c.movie})</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const diff = sent !== null
  const timerClass = countdown == null ? '' : countdown <= 3 ? 'timer warn' : 'timer'

  return (
    <div className="wrap col" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="row spread">
        <span className="act">Operação Agenda · plateia</span>
        <span className="row">
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
          <button className="ghost" onClick={async () => {
              if (room && playerId && charId) await releaseCharacter(room, playerId)
              setReady(false)
            }}>
              {char?.emoji} trocar
            </button>
          <span className="pill">sala {room}</span>
        </span>
      </div>

      <div className="row spread">
        <span className="pill">
          <CharAvatar c={char} size={20} /> {name}
        </span>
        <span className="row">
          <span className="pill">{score.score} pts{score.combo > 1 ? ` · combo ${score.combo}` : ''}</span>
          {myRank >= 0 && <span className="pill">{myRank + 1}º lugar</span>}
        </span>
      </div>

      <div className="card col">
        <div className="row spread">
          <div className="row" style={{ gap: 8 }}>
            <span className="act">{phase.act}</span>
            <span className="pill on">Atividade {phase.activity}/5 · {ACTIVITIES[phase.activity]}</span>
          </div>
          {countdown != null && (
            <div className={timerClass}>
              <span>{fmtTime(countdown)}</span>
              <small>s</small>
            </div>
          )}
        </div>
        <h2>{phase.title}</h2>
        <p>{phase.prompt}</p>

        {phase.kind === 'objetivos' && (
          <div className="col" style={{ gap: 6 }}>
            {phase.objectives?.map((o, i) => (
              <div key={i} className="row spread">
                <span>{o.text}</span>
                <span className="pill on">{o.cell}</span>
              </div>
            ))}
          </div>
        )}

        {phase.kind === 'conceito' && (
          <div className="col" style={{ gap: 10 }}>
            {phase.definition && <div className="quote">{phase.definition}</div>}
            {phase.concept?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="pill on" style={{ flex: 'none' }}>{i + 1}</span>
                <div>
                  <b>{s.label}</b>
                  {s.detail && <div className="muted small">{s.detail}</div>}
                </div>
              </div>
            ))}
            {phase.strategies && (
              <div className="col" style={{ gap: 8, marginTop: 2 }}>
                <div className="act">Estratégias de abstração</div>
                {phase.strategies.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span className="pill on" style={{ flex: 'none' }}>{i + 1}</span>
                    <div>
                      <b>{s.name}</b>
                      {s.detail && <div className="muted small">{s.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {phase.note && <div className="small muted">{phase.note}</div>}
          </div>
        )}

        {phase.kind === 'debrief' && (
          <div className="col" style={{ gap: 10 }}>
            <div className="col" style={{ gap: 8 }}>
              {phase.pillars?.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
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
            {wcSaved && (
              <div className="bubble" style={{ borderColor: 'var(--ok)' }}>
                <div className="small muted" style={{ marginBottom: 4 }}>Na pesquisa você respondeu</div>
                <div className="small">Decisão: {wcDecisao || '—'}</div>
                <div className="small">Destacar: {wcDestacar || '—'} · Ignorar: {wcIgnorar || '—'}</div>
                <div className="small">Passos: {wcSteps.length ? wcSteps.join(' → ') : '—'}</div>
                <div style={{ marginTop: 6 }}><strong>Você mudaria algo agora?</strong></div>
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
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>{phase.research.prompt}</p>

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

            <div className="col" style={{ gap: 8 }}>
              <div className="act">Sua ficha</div>
              <label className="small muted">
                Nome da decisão
                <input
                  type="text"
                  value={wcDecisao}
                  onChange={(e) => setWcDecisao(e.target.value)}
                  placeholder="ex.: dá pra encaixar mais uma reunião?"
                />
              </label>
              <label className="small muted">
                O que impacta a decisão (destacar)
                <input
                  type="text"
                  value={wcDestacar}
                  onChange={(e) => setWcDestacar(e.target.value)}
                  placeholder="ex.: horários, duração"
                />
              </label>
              <label className="small muted">
                O que não importa (ignorar)
                <input
                  type="text"
                  value={wcIgnorar}
                  onChange={(e) => setWcIgnorar(e.target.value)}
                  placeholder="ex.: quem convocou"
                />
              </label>
              <div className="small muted">Passos, na ordem (mínimo 3)</div>
              <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                <input
                  type="text"
                  value={wcStep}
                  onChange={(e) => setWcStep(e.target.value)}
                  placeholder="ex.: ver os horários"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addStep()
                    }
                  }}
                />
                <button onClick={addStep}>adicionar</button>
              </div>
              {wcSteps.length > 0 && (
                <div className="col" style={{ gap: 4 }}>
                  {wcSteps.map((s, i) => (
                    <div key={i} className="row" style={{ gap: 8 }}>
                      <span className="pill on">{i + 1}</span>
                      <span style={{ flex: 1 }}>{s}</span>
                      <button className="ghost" onClick={() => removeStep(i)}>remover</button>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="primary"
                disabled={wcSteps.length < 3 || !wcDecisao.trim() || !wcDestacar.trim() || !wcIgnorar.trim()}
                onClick={saveWs}
              >
                {wcSaved ? 'salvar de novo' : 'salvar minha ficha'}
              </button>
              {wcSaved && <span className="pill on">ficha salva ✓</span>}
            </div>

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
                  disabled={locked}
                  onClick={() => {
                    setSent(o.id)
                    sfxClick()
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
                  disabled={locked}
                  onClick={() => setMulti((m) => (m.includes(o.id) ? m.filter((x) => x !== o.id) : [...m, o.id]))}
                >
                  <span>{o.label}</span>
                  <span>{on ? '✅' : missing ? '＋' : ''}</span>
                </button>
              )
            })}
            <button
              className="primary"
              disabled={locked || multi.length === 0}
              onClick={() => {
                const enc = encodeChoice('multi', multi)
                setSent(enc)
                sfxClick()
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
                  disabled={locked}
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
              disabled={locked || seq.length !== (phase.options?.length || 0)}
              onClick={() => {
                const enc = encodeChoice('order', seq)
                setSent(enc)
                sfxClick()
                sendVote(room, playerId || 'anon', phase.id, enc)
              }}
            >
              {diff ? 'reenviar ordem' : 'enviar ordem'}
            </button>
          </div>
        )}

        {phase.kind === 'info' && <p className="muted">Aguarde o apresentador.</p>}
        {countdown === 0 && !revealed && <p className="pill off">⏱ tempo esgotado</p>}
        {diff && !revealed && countdown !== 0 && (
          <p className="muted small">Resposta enviada. Olhe a tela do apresentador.</p>
        )}
        {revealed && isInteractive(phase.kind) && (
          <p className={isCorrect(phase, sent) ? 'pill on' : 'pill off'}>
            {isCorrect(phase, sent) ? 'Você acertou! +10' : 'Não foi dessa vez.'}
          </p>
        )}
        {revealed && phase.explain && (
          <div className="bubble" style={{ borderColor: 'var(--ok)' }}>
            <strong>Por quê:</strong> {phase.explain}
          </div>
        )}

        {phase.sources && (
          <div className="small muted" style={{ marginTop: 4 }}>
            <strong>Fontes:</strong> {phase.sources.join(' · ')}
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