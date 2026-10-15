'use client'

/**
 * Ilustrações da aula. Todos os SVG usam viewBox + width 100% para escalarem
 * junto com o contêiner (sem vazar do cartão no mobile).
 */

/** Analogia 1 — "Da intenção às instruções": o sanduíche. */
export function SandwichArt({ size = 260 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 240 164"
      role="img"
      aria-label="Sanduíche"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      {/* prato */}
      <ellipse cx="120" cy="150" rx="100" ry="10" fill="#1e242e" />

      {/* pão de baixo */}
      <rect x="44" y="126" width="152" height="20" rx="10" fill="#d9a066" />

      {/* carne */}
      <rect x="50" y="116" width="140" height="12" rx="6" fill="#8a5a3b" />

      {/* queijo derretido */}
      <rect x="54" y="108" width="132" height="9" rx="3" fill="#f2c14e" />
      <g fill="none" stroke="#f2c14e" strokeWidth="5" strokeLinecap="round">
        <path d="M64 117 q6 9 12 0" />
        <path d="M96 117 q6 9 12 0" />
        <path d="M128 117 q6 9 12 0" />
        <path d="M160 117 q6 9 12 0" />
      </g>

      {/* tomate */}
      <rect x="56" y="100" width="128" height="8" rx="4" fill="#e05a3d" />

      {/* alface ondulada */}
      <path
        d="M56 100 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0 q12 -12 24 0"
        fill="none"
        stroke="#7ec850"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* pão de cima */}
      <path d="M44 96 Q44 48 120 48 Q196 48 196 96 Z" fill="#e0b074" />

      {/* gergelim */}
      <circle cx="86" cy="66" r="3" fill="#c98f4f" />
      <circle cx="118" cy="58" r="3" fill="#c98f4f" />
      <circle cx="150" cy="66" r="3" fill="#c98f4f" />
      <circle cx="102" cy="80" r="2.6" fill="#c98f4f" />
      <circle cx="138" cy="80" r="2.6" fill="#c98f4f" />
    </svg>
  )
}

const MAP_COLORS = {
  accent: '#4f8cff',
  muted: '#9aa4b2',
  line: '#5b6478',
  panel: '#161b24',
  warn: '#e0533d',
  green: '#7ec850',
}

// geometria do mapa (com folga embaixo para os selos)
const P = { x: 6, y: 26, w: 408, h: 206 }
const NODES = [
  { x: 62, y: 172, label: 'Escola', dy: -14 },
  { x: 200, y: 96, label: 'Praça', dy: -14 },
  { x: 350, y: 140, label: 'Hospital', dy: -14 },
  { x: 200, y: 176, label: 'Mercado', dy: 22 },
]
const EDGES = ['M62 172 C 100 146 150 126 200 96', 'M200 96 C 250 106 300 126 350 140', 'M200 96 L 200 176']

/**
 * ABSTRAÇÃO — uma transformação visível, etapa por etapa.
 * 0 = situação (a cidade inteira) · 1 = escolhas (o que preservar / deixar de fora)
 * 2 = representação (pontos e conexões) · 3 = operação (percorrer as conexões)
 * 4 = limite (a pergunta mudou: faltam os tempos)
 */
export function MapStage({ step, size = 460 }: { step: number; size?: number }) {
  const { accent, muted, line, panel, warn, green } = MAP_COLORS
  const clean = step >= 1
  const street = clean ? accent : '#6b6f7a'
  const showLabels = step >= 2

  const titles = [
    'Situação · a cidade inteira',
    'Escolhas · o que preservar',
    'Representação · locais viram pontos',
    'Operação · percorrer as conexões',
    'Limite · a pergunta mudou',
  ]

  return (
    <svg
      viewBox="0 0 420 250"
      role="img"
      aria-label={`Abstração — etapa ${step}: ${titles[step] || ''}`}
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      <rect x={P.x} y={P.y} width={P.w} height={P.h} rx="12" fill={panel} stroke={clean ? accent : line} />
      <text x="210" y="18" textAnchor="middle" fontSize="13" fontWeight="700" fill={clean ? accent : muted}>
        {titles[step]}
      </text>

      {/* ---- 0 · situação: o ruído do mundo real ---- */}
      {step === 0 && (
        <g>
          <g fill="#3a4252">
            <rect x="34" y="70" width="30" height="22" rx="2" />
            <polygon points="34,70 49,57 64,70" />
            <rect x="306" y="60" width="34" height="24" rx="2" />
            <polygon points="306,60 323,46 340,60" />
            <rect x="46" y="140" width="26" height="20" rx="2" />
            <polygon points="46,140 59,128 72,140" />
            <rect x="304" y="180" width="30" height="22" rx="2" />
            <polygon points="304,180 319,168 334,180" />
          </g>
          <g>
            <circle cx="120" cy="78" r="9" fill={green} />
            <rect x="118" y="86" width="4" height="8" fill="#5b4a2f" />
            <circle cx="252" cy="72" r="8" fill={green} />
            <rect x="250" y="79" width="4" height="7" fill="#5b4a2f" />
            <circle cx="120" cy="200" r="8" fill={green} />
            <rect x="118" y="207" width="4" height="7" fill="#5b4a2f" />
            <circle cx="286" cy="116" r="7" fill={green} />
            <rect x="284" y="122" width="4" height="6" fill="#5b4a2f" />
          </g>
          <line x1="62" y1="164" x2="350" y2="132" stroke="#c9a24d" strokeWidth="2" opacity="0.7" />
          <g stroke={warn} strokeWidth="1.4" fill="none" strokeLinecap="round">
            <path d="M176 206 l7 -6 l-5 -6 l8 -5" />
            <path d="M300 212 l6 -5 l-4 -7 l7 -4" />
          </g>
          <rect x="112" y="34" width="196" height="16" rx="8" fill={warn} opacity="0.18" />
          <text x="210" y="46" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={warn}>
            1:1 — do tamanho da cidade · inútil
          </text>
        </g>
      )}

      {/* ---- 1 · escolhas: o que fica de fora ---- */}
      {step === 1 && (
        <g opacity="0.55">
          <rect x="34" y="70" width="30" height="22" rx="2" fill={line} />
          <circle cx="120" cy="78" r="9" fill={line} />
          <rect x="46" y="140" width="26" height="20" rx="2" fill={line} />
          <g stroke={warn} strokeWidth="2.4" strokeLinecap="round">
            <line x1="30" y1="66" x2="68" y2="96" />
            <line x1="68" y1="66" x2="30" y2="96" />
            <line x1="110" y1="68" x2="130" y2="88" />
            <line x1="130" y1="68" x2="110" y2="88" />
            <line x1="42" y1="136" x2="76" y2="164" />
            <line x1="76" y1="136" x2="42" y2="164" />
          </g>
        </g>
      )}

      {/* ---- caminhos (ruas → conexões) ---- */}
      <g fill="none" stroke={street} strokeWidth="5" strokeLinecap="round">
        {EDGES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* ---- 3 · operação: destaca o caminho Escola → Praça → Hospital ---- */}
      {step === 3 && (
        <g fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" opacity="0.95">
          <path d="M62 172 C 100 146 150 126 200 96" />
          <path d="M200 96 C 250 106 300 126 350 140" />
        </g>
      )}

      {/* nós */}
      {NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="7" fill="#0b1020" stroke={street} strokeWidth="4" />
      ))}

      {/* rótulos dos locais (a partir da representação) */}
      {showLabels &&
        NODES.map((n, i) => (
          <text key={i} x={n.x} y={n.y + n.dy} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={muted}>
            {n.label}
          </text>
        ))}

      {showLabels && (
        <>
          <text x="92" y="128" fontSize="9.5" fill={muted}>
            800 m
          </text>
          <text x="284" y="106" fontSize="9.5" fill={muted}>
            2 km
          </text>
        </>
      )}

      {/* ---- 3 · selo da busca ---- */}
      {step === 3 && (
        <g>
          <rect x="92" y="210" width="236" height="17" rx="8.5" fill={accent} opacity="0.18" />
          <text x="210" y="222.5" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={accent}>
            existe caminho: Escola → Praça → Hospital
          </text>
        </g>
      )}

      {/* ---- 4 · limite: faltam os tempos ---- */}
      {step === 4 && (
        <g>
          <text x="126" y="128" fontSize="10" fontWeight="700" fill={warn}>
            ? min
          </text>
          <text x="310" y="106" fontSize="10" fontWeight="700" fill={warn}>
            ? min
          </text>
          <rect x="72" y="210" width="276" height="17" rx="8.5" fill={warn} opacity="0.18" />
          <text x="210" y="222.5" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={warn}>
            “qual o caminho mais rápido?” → faltam os tempos
          </text>
        </g>
      )}
    </svg>
  )
}
