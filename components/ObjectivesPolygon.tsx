'use client'

import { ObjectiveIcon } from './ObjectiveIcon'

type Item = { icon?: string; label: string }

/**
 * Fluxograma em (poli)gono: os itens ficam nos vértices de um polígono regular
 * — com 5 itens, um **pentágono** — ligados por setas em sequência (ciclo).
 * Os itens são cartões (não hexágonos); o formato do conjunto é que é poligonal.
 */
export function ObjectivesPolygon({
  items,
  size = 420,
  radius = 0.37,
}: {
  items: Item[]
  size?: number
  radius?: number
}) {
  const n = items.length
  if (n === 0) return null
  const accent = '#4f8cff'
  const cx = size / 2
  const cy = size / 2
  const R = size * radius

  // vértices do polígono, começando no topo e seguindo horário
  const pos = items.map((_, i) => {
    const a = ((-90 + (i * 360) / n) * Math.PI) / 180
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
  })

  // recuo das setas para não entrarem nos cartões
  const gap = 60

  return (
    <div className="poly-wrap" style={{ width: size, height: size }}>
      <svg className="poly-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
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
        <div key={i} className="poly-node" style={{ left: pos[i].x, top: pos[i].y }}>
          {it.icon && <ObjectiveIcon name={it.icon} size={30} />}
          <b>{it.label}</b>
        </div>
      ))}
    </div>
  )
}
