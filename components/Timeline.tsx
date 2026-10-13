'use client'

import type { TimelineSpec } from '@/lib/game'

function fmt(h: number) {
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  return mm ? `${hh}h${String(mm).padStart(2, '0')}` : `${hh}h`
}

export function Timeline({ spec }: { spec: TimelineSpec }) {
  const [w0, w1] = spec.window
  const span = w1 - w0
  const ticks: number[] = []
  for (let h = Math.ceil(w0); h <= Math.floor(w1); h++) ticks.push(h)

  return (
    <div className="tl">
      <div className="tl-day">{spec.day}</div>
      <div className="tl-axis">
        {ticks.map((h) => (
          <span key={h} className="tl-tick" style={{ left: `${((h - w0) / span) * 100}%` }}>
            {h}h
          </span>
        ))}
      </div>
      {spec.lanes.map((lane) => (
        <div key={lane.name} className="tl-lane">
          <div className="tl-name">{lane.name}</div>
          <div className="tl-track">
            {ticks.map((h) => (
              <span key={h} className="tl-grid" style={{ left: `${((h - w0) / span) * 100}%` }} />
            ))}
            {lane.blocks.map((b, i) => {
              const left = ((b.start - w0) / span) * 100
              const width = Math.max(2, ((b.end - b.start) / span) * 100)
              return (
                <div
                  key={i}
                  className={`tl-block ${b.kind}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={b.label}
                >
                  <span>{b.label || `${fmt(b.start)}–${fmt(b.end)}`}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
