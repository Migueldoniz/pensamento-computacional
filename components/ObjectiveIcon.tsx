'use client'

/** Ícone visual de cada objetivo (linha, cor = accent). */
export function ObjectiveIcon({ name, size = 44 }: { name: string; size?: number }) {
  const p = {
    stroke: 'currentColor',
    strokeWidth: 2.6,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ color: 'var(--accent)' }} aria-hidden>
      {name === 'understand' && (
        <>
          <circle cx="20" cy="16" r="9" {...p} />
          <line x1="20" y1="25" x2="20" y2="30" {...p} />
          <line x1="15" y1="30" x2="25" y2="30" {...p} />
          <line x1="20" y1="9" x2="20" y2="6" {...p} />
        </>
      )}
      {name === 'analyze' && (
        <>
          <circle cx="17" cy="17" r="9" {...p} />
          <line x1="23.5" y1="23.5" x2="32" y2="32" {...p} />
        </>
      )}
      {name === 'decompose' && (
        <>
          <rect x="5" y="5" width="13" height="13" rx="2" {...p} />
          <rect x="22" y="5" width="13" height="13" rx="2" {...p} />
          <rect x="13" y="22" width="13" height="13" rx="2" {...p} />
        </>
      )}
      {name === 'plan' && (
        <>
          <line x1="12" y1="11" x2="33" y2="11" {...p} />
          <line x1="12" y1="20" x2="33" y2="20" {...p} />
          <line x1="12" y1="29" x2="33" y2="29" {...p} />
          <circle cx="6" cy="11" r="2.2" fill="currentColor" />
          <circle cx="6" cy="20" r="2.2" fill="currentColor" />
          <circle cx="6" cy="29" r="2.2" fill="currentColor" />
        </>
      )}
      {name === 'transfer' && (
        <>
          <rect x="4" y="8" width="12" height="12" rx="2" {...p} />
          <rect x="24" y="20" width="12" height="12" rx="2" {...p} />
          <path d="M16 14 Q22 14 26 22" {...p} />
          <path d="M26 22 L21 21 M26 22 L24 17" {...p} />
        </>
      )}
    </svg>
  )
}
