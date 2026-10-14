'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { recordRoom } from '@/lib/client'

export default function Home() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)

  const create = async () => {
    setBusy(true)
    const r = await recordRoom()
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
          <button className="primary" onClick={create} disabled={busy}>
            {busy ? 'Criando…' : 'Criar sala (apresentador)'}
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

          <p className="small muted">
            Sem configurar nada, as salas são salvas em arquivo local
            (<span className="mono">.data/rooms.json</span>). No Vercel, use Upstash.
          </p>
        </div>
      </div>
    </main>
  )
}
