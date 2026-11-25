'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { recordRoom } from '@/lib/client'

export default function Home() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [health, setHealth] = useState<{ mode: string; vercel: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {})
  }, [])

  const create = async (season: '1' | '2' | '3') => {
    setBusy(true)
    const r = await recordRoom(undefined, season)
    try {
      localStorage.setItem(`oa_host:${r.code}`, r.token)
    } catch {
      /* ignore */
    }
    router.push(`/host?room=${r.code}`)
  }

  const join = () => {
    const c = code.trim().toUpperCase()
    if (c) router.push(`/play?room=${c}`)
  }

  return (
    <main className="center">
      <div className="wrap col" style={{ maxWidth: 560 }}>
        <div>
          <div className="act">Operação Agenda</div>
          <h1>Você é o Robô</h1>
          <p className="muted">
            Um jogo de 15 minutos sobre agendamento de laboratório e pensamento
            computacional. A plateia vota pelo celular; o robô decide — e às vezes erra.
          </p>
        </div>

        <div className="card col">
          <button className="primary" onClick={() => create('1')} disabled={busy}>
            {busy ? 'Criando…' : 'Criar sala · Aula 1 (Pensamento Computacional)'}
          </button>
          <button className="primary" onClick={() => create('2')} disabled={busy}>
            {busy ? 'Criando…' : 'Criar sala · Aula 2 (Requisitos)'}
          </button>
          <button className="primary" onClick={() => create('3')} disabled={busy}>
            {busy ? 'Criando…' : 'Criar sala · Aula 3 (Níveis de abstração)'}
          </button>

          <div className="row">
            <input
              type="text"
              placeholder="Código da sala (ex.: ABCD)"
              value={code}
              maxLength={8}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') join()
              }}
            />
            <button onClick={join}>Entrar (plateia)</button>
          </div>

          {health && health.vercel && health.mode === 'file' && (
            <div className="bubble" style={{ borderColor: 'var(--bad)', fontSize: 14 }}>
              ⚠ <strong>Este deploy está sem Upstash.</strong> No Vercel, o arquivo local não persiste —
              as salas <strong>somem</strong> e aparece “Sala não encontrada”. Configure{' '}
              <span className="mono">UPSTASH_REDIS_REST_URL</span> e{' '}
              <span className="mono">UPSTASH_REDIS_REST_TOKEN</span> e faça o <em>redeploy</em>.
            </div>
          )}
          {health && health.mode === 'file' && !health.vercel && (
            <p className="small muted">
              💾 Armazenamento local (arquivo). Tudo certo para rodar na sua máquina.
            </p>
          )}
          {health && health.mode === 'upstash' && (
            <p className="small muted">☁️ Armazenamento Upstash conectado.</p>
          )}
        </div>
      </div>
    </main>
  )
}
