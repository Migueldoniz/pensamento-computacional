'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PHASES, encodeChoice, isCorrect } from '@/lib/game'
import { getSnapshot, sendVote, postScore, PlayerScore } from '@/lib/client'
import { Timeline } from '@/components/Timeline'
import { CHARACTERS, characterById } from '@/lib/characters'
import { useCountdown } from '@/lib/useCountdown'
import { initSound, isMuted, setMuted, sfxCorrect, sfxWrong, sfxTick, sfxClick, sfxWin } from '@/lib/sound'

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
  const [charId, setCharId] = useState('')
  const [ready, setReady] = useState(false)
  const [muted, setMutedState] = useState(false)

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)
  const [scores, setScores] = useState<Record<string, PlayerScore>>({})

  const [sent, setSent] = useState<string | null>(null)
  const [multi, setMulti] = useState<string[]>([])
  const [seq, setSeq] = useState<string[]>([])
  const [score, setScore] = useState<Score>({ score: 0, combo: 0 })

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
      setDeadline(s.deadline ?? null)
      setScores(s.scores || {})
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

  // Pontuação + ranking.
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
    if (good) sfxCorrect()
    else sfxWrong()
    if (room && playerId) postScore(room, playerId, name, next.score, next.combo)
  }, [revealed, phase.id, phase.kind, sent, score.score, score.combo, room, playerId, name])

  // Som dos últimos segundos.
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

  function pickCharacter(id: string) {
    localStorage.setItem('oa_name', id)
    setCharId(id)
    setReady(true)
    sfxClick()
    if (room && playerId) postScore(room, playerId, characterById(id)?.name || 'Anônimo', score.score, score.combo)
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
    return (
      <div className="wrap col" style={{ maxWidth: 820, margin: '0 auto' }}>
        <div>
          <div className="act">Operação Agenda · sala {room}</div>
          <h1 style={{ marginBottom: 4 }}>Escolha seu personagem</h1>
          <p className="muted">Ele será o seu nickname no jogo.</p>
        </div>
        <div className="chars">
          {CHARACTERS.map((c) => (
            <button key={c.id} className="char" onClick={() => pickCharacter(c.id)}>
              <span className="char-emoji">{c.emoji}</span>
              <span>{c.name}</span>
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
          <button className="ghost" onClick={() => setReady(false)}>
            {char?.emoji} trocar
          </button>
          <span className="pill">sala {room}</span>
        </span>
      </div>

      <div className="row spread">
        <span className="pill">
          {char?.emoji} {name}
        </span>
        <span className="row">
          <span className="pill">{score.score} pts{score.combo > 1 ? ` · combo ${score.combo}` : ''}</span>
          {myRank >= 0 && <span className="pill">{myRank + 1}º lugar</span>}
        </span>
      </div>

      <div className="card col">
        <div className="row spread">
          <div className="act">{phase.act}</div>
          {countdown != null && (
            <div className={timerClass}>
              <span>{countdown}</span>
              <small>s</small>
            </div>
          )}
        </div>
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
