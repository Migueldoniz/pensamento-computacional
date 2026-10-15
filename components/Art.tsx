'use client'

/** Analogia 1 — "Da intenção às instruções": o sanduíche. */
export function SandwichArt({ size = 240 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 240 150" role="img" aria-label="Sanduíche">
      {/* prato */}
      <ellipse cx="120" cy="132" rx="95" ry="12" fill="#1e242e" />
      {/* pão de baixo */}
      <rect x="40" y="100" width="160" height="24" rx="12" fill="#d9a066" />
      {/* recheio */}
      <rect x="44" y="90" width="152" height="10" rx="4" fill="#7ec850" />
      <rect x="44" y="84" width="152" height="8" rx="4" fill="#e05a3d" />
      <rect x="52" y="76" width="136" height="10" rx="5" fill="#f2c14e" />
      {/* pão de cima */}
      <path d="M40 78 Q40 44 120 44 Q200 44 200 78 Z" fill="#e0b074" />
      {/* gergelim */}
      <circle cx="90" cy="58" r="3" fill="#c98f4f" />
      <circle cx="120" cy="52" r="3" fill="#c98f4f" />
      <circle cx="150" cy="58" r="3" fill="#c98f4f" />
      {/* rótulo */}
      <text x="120" y="20" textAnchor="middle" fontSize="15" fontWeight="700" fill="#9aa4b2">
        “Prepare um sanduíche”
      </text>
    </svg>
  )
}

/** Analogia 2 — "Um mapa não mostra tudo": abstração de uma cidade. */
export function MapArt({ size = 300 }: { size?: number }) {
  const accent = '#4f8cff'
  const muted = '#9aa4b2'
  const line = '#5b6478'
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 320 200" role="img" aria-label="Mapa esquemático">
      {/* fundo: "cidade" com ruído (árvores, fachadas) riscadas */}
      <g opacity="0.35">
        <rect x="30" y="26" width="22" height="30" rx="3" fill={line} />
        <circle cx="130" cy="26" r="10" fill={line} />
        <rect x="250" y="26" width="26" height="30" rx="3" fill={line} />
        <circle cx="210" cy="40" r="9" fill={line} />
      </g>
      {/* riscos */}
      <g stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round">
        <line x1="26" y1="22" x2="56" y2="60" />
        <line x1="56" y1="22" x2="26" y2="60" />
        <line x1="118" y1="14" x2="142" y2="38" />
        <line x1="142" y1="14" x2="118" y2="38" />
        <line x1="196" y1="28" x2="224" y2="52" />
        <line x1="224" y1="28" x2="196" y2="52" />
      </g>

      {/* grafo limpo: ruas e conexões */}
      <line x1="70" y1="150" x2="160" y2="90" stroke={accent} strokeWidth="4" />
      <line x1="160" y1="90" x2="250" y2="150" stroke={accent} strokeWidth="4" />
      <circle cx="70" cy="150" r="18" fill={accent} />
      <circle cx="160" cy="90" r="18" fill={accent} />
      <circle cx="250" cy="150" r="18" fill={accent} />
      <text x="70" y="156" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b1020">A</text>
      <text x="160" y="96" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b1020">B</text>
      <text x="250" y="156" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b1020">C</text>

      {/* legenda */}
      <text x="160" y="184" textAnchor="middle" fontSize="13" fill={muted}>
        ruas e conexões = o que importa
      </text>
    </svg>
  )
}
