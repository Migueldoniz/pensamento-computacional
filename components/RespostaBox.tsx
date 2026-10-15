'use client'

import { useEffect, useState } from 'react'
import { saveResposta } from '@/lib/client'
import { characterById } from '@/lib/characters'
import { PHASES } from '@/lib/game'
import { Rich } from '@/components/Rich'

const RESEARCH_PROMPT = PHASES.find((p) => p.kind === 'pesquisa')?.research?.prompt || ''

/**
 * Pergunta da pesquisa + envio da resposta, no fim da página das fontes.
 * O aluno lê as fontes e responde aqui mesmo (sem voltar para /play).
 */
export function RespostaBox({ room }: { room: string }) {
  const [playerId, setPlayerId] = useState('')
  const [name, setName] = useState('Anônimo')
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      const charId = room ? localStorage.getItem(`oa_char:${room}`) || '' : ''
      setName(characterById(charId)?.name || 'Anônimo')
      // garante uma identidade mesmo se o aluno abrir esta página direto
      let id = localStorage.getItem('oa_player') || ''
      if (!id) {
        id = Math.random().toString(36).slice(2, 9)
        localStorage.setItem('oa_player', id)
      }
      setPlayerId(id)
    } catch {
      /* ignore */
    }
  }, [])

  async function send() {
    if (!room || !playerId || !text.trim() || busy) return
    setBusy(true)
    await saveResposta(room, playerId, name, text.trim())
    setBusy(false)
    setSent(true)
  }

  const ready = Boolean(room && playerId)

  return (
    <section className="source" style={{ borderColor: 'var(--accent)' }}>
      <div className="source-tag">Pergunta</div>
      <p style={{ margin: '8px 0 12px', fontSize: 18, lineHeight: 1.5 }}>
        <Rich text={RESEARCH_PROMPT} />
      </p>

      <div className="col" style={{ gap: 10 }}>
        <label className="small muted">
          Sua resposta (breve)
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ex.: escolher o que representar"
            disabled={!ready}
          />
        </label>

        <div className="row" style={{ gap: 10, alignItems: 'center' }}>
          <button className="primary" disabled={!ready || !text.trim() || busy} onClick={send}>
            {sent ? 'enviar de novo' : 'enviar resposta'}
          </button>
          {sent && <span className="pill on">enviada ✓ aparece no telão</span>}
        </div>

        {!ready && (
          <span className="small muted">
            Abra esta página pelo link da sala para se identificar antes de responder.
          </span>
        )}
      </div>
    </section>
  )
}
