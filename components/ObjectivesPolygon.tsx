'use client'

import { useEffect, useRef, useState } from 'react'
import { ObjectiveIcon } from './ObjectiveIcon'

type Item = { icon?: string; label: string }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/**
 * Fluxograma em (poli)gono: os itens ficam nos vértices de um polígono regular
 * — com 5 itens, um **pentágono** — ligados por setas em sequência (ciclo).
 * Os itens são cartões (não hexágonos); o formato do conjunto é que é poligonal.
 *
 * O tamanho se adapta à largura do contêiner (responsivo/mobile).
 */
export function ObjectivesPolygon({
  items,
  size = 430,
  radius = 0.37,
}: {
  items: Item[]
  size?: number
  radius?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [avail, setAvail] = useState(size)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement
    const measure = () => setAvail(parent ? parent.clientWidth : size)
    measure()
    const ro = new ResizeObserver(measure)
    if (parent) ro.observe(parent)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [size])

  const n = items.length
  if (n === 0) return null

  const s = clamp(Math.min(size, avail || size), 210, size)
  const accent = '#4f8cff'
  const cx = s / 2
  const cy = s / 2
  const R = s * radius
  const cardW = clamp(s * 0.27, 78, 116)
  const iconSize = clamp(s * 0.07, 20, 30)
  const fontPx = clamp(s * 0.033, 11, 14)
  // recuo das setas: grande o bastante para não entrar nos cartões
  const gap = Math.max(s * 0.145, cardW * 0.5)

  const pos = items.map((_, i) => {
    const a = ((-90 + (i * 360) / n) * Math.PI) / 180
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
  })

  return (
    <div ref={ref} className="poly-wrap" style={{ width: s, height: s, maxWidth: '100%' }}>
      <svg className="poly-svg" width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
        <defs>
          <marker id="poly-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill={accent} />
          </marker>
        </defs>
        {pos.map((p, i) => {
          const q = pos[(i + 1) % n]
          const dx = q.x - p.x
          const dy = q.y - p.y
          const len = Math.hypot(dx, dy) || 1
          const ux = dx / len
          const uy = dy / len
          return (
            <line
              key={i}
              x1={p.x + ux * gap}
              y1={p.y + uy * gap}
              x2={q.x - ux * gap}
              y2={q.y - uy * gap}
              stroke={accent}
              strokeWidth={3}
              strokeLinecap="round"
              markerEnd="url(#poly-arrow)"
            />
          )
        })}
      </svg>

      {items.map((it, i) => (
        <div
          key={i}
          className="poly-node"
          style={{ left: pos[i].x, top: pos[i].y, width: cardW, fontSize: fontPx }}
        >
          {it.icon && <ObjectiveIcon name={it.icon} size={iconSize} />}
          <b style={{ fontSize: fontPx }}>{it.label}</b>
        </div>
      ))}
    </div>
  )
}
