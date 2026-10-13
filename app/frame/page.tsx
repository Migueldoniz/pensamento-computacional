'use client'

import { useEffect, useState } from 'react'
import { CHARACTERS } from '@/lib/characters'
import { CharAvatar } from '@/components/CharAvatar'

interface XY {
  x: number
  y: number
}

export default function FramePage() {
  const [vals, setVals] = useState<Record<string, XY>>({})
  const [copied, setCopied] = useState('')

  useEffect(() => {
    try {
      setVals(JSON.parse(localStorage.getItem('oa_frame') || '{}'))
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('oa_frame', JSON.stringify(vals))
    } catch {
      /* ignore */
    }
  }, [vals])

  const get = (id: string): XY => vals[id] || { x: 50, y: 20 }
  const set = (id: string, patch: Partial<XY>) =>
    setVals((v) => ({ ...v, [id]: { ...get(id), ...patch } }))

  return (
    <div className="wrap">
      <div className="act">Operação Agenda · ajuste de enquadramento</div>
      <h1>Enquadrar avatares</h1>
      <p className="muted">
        Arraste os controles até a foto ficar boa. Copie o valor de <code>pos</code> e cole no
        personagem em <code>lib/characters.ts</code>. Os ajustes ficam salvos no navegador.
      </p>

      <div className="chars" style={{ marginTop: 16 }}>
        {CHARACTERS.map((c) => {
          const g = get(c.id)
          const pos = `${g.x}% ${g.y}%`
          return (
            <div key={c.id} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <CharAvatar c={c} size={96} pos={pos} />
              <div className="col" style={{ flex: 1, gap: 6 }}>
                <b>{c.name}</b>
                <label className="small muted">
                  Horizontal {g.x}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={g.x}
                    onChange={(e) => set(c.id, { x: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </label>
                <label className="small muted">
                  Vertical {g.y}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={g.y}
                    onChange={(e) => set(c.id, { y: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </label>
                <div className="row">
                  <code className="mono small">pos: '{pos}'</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`pos: '${pos}'`)
                      setCopied(c.id)
                      setTimeout(() => setCopied(''), 1200)
                    }}
                  >
                    {copied === c.id ? 'copiado!' : 'copiar'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
