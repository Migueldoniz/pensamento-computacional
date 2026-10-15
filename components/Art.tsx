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

/** Mapa horizontal (telas largas): mundo real → filtro → abstração. */
export function MapArtWide({ size = 460 }: { size?: number }) {
  const { accent, muted, line, panel, warn, green } = MAP_COLORS
  return (
    <svg
      viewBox="0 0 460 224"
      role="img"
      aria-label="Mundo real cheio de detalhes versus mapa abstrato"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      {/* ---- painel esquerdo: mundo real, cheio de detalhes ---- */}
      <rect x="6" y="30" width="200" height="184" rx="12" fill={panel} stroke={line} />
      <text x="106" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>
        Mundo real
      </text>

      <line x1="16" y1="112" x2="196" y2="112" stroke="#6b6f7a" strokeWidth="16" />
      <line x1="90" y1="40" x2="90" y2="206" stroke="#6b6f7a" strokeWidth="14" />
      <line x1="16" y1="104" x2="196" y2="104" stroke="#c9a24d" strokeWidth="2" opacity="0.7" />

      <g fill="#3a4252">
        <rect x="20" y="60" width="26" height="20" rx="2" />
        <polygon points="20,60 33,48 46,60" />
        <rect x="118" y="58" width="30" height="22" rx="2" />
        <polygon points="118,58 133,45 148,58" />
        <rect x="24" y="140" width="24" height="18" rx="2" />
        <polygon points="24,140 36,129 48,140" />
        <rect x="120" y="150" width="28" height="20" rx="2" />
        <polygon points="120,150 134,138 148,150" />
      </g>

      <g>
        <circle cx="66" cy="70" r="9" fill={green} />
        <rect x="64" y="78" width="4" height="8" fill="#5b4a2f" />
        <circle cx="150" cy="72" r="8" fill={green} />
        <rect x="148" y="79" width="4" height="7" fill="#5b4a2f" />
        <circle cx="66" cy="168" r="8" fill={green} />
        <rect x="64" y="175" width="4" height="7" fill="#5b4a2f" />
        <circle cx="168" cy="130" r="7" fill={green} />
        <rect x="166" y="136" width="4" height="6" fill="#5b4a2f" />
      </g>

      <g stroke={warn} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M20 186 l7 -6 l-5 -6 l8 -5" />
        <path d="M150 186 l6 -5 l-4 -7 l7 -4" />
        <path d="M100 40 l5 6 l-4 6 l6 5" />
      </g>

      <rect x="24" y="194" width="164" height="16" rx="8" fill={warn} opacity="0.18" />
      <text x="106" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill={warn}>
        1:1 — do tamanho da cidade · inútil
      </text>

      {/* ---- seta central ---- */}
      <line x1="210" y1="112" x2="246" y2="112" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <polygon points="248,112 239,107 239,117" fill={accent} />
      <text x="229" y="132" textAnchor="middle" fontSize="10" fontWeight="700" fill={accent}>
        filtra
      </text>
      <text x="229" y="144" textAnchor="middle" fontSize="10" fontWeight="700" fill={accent}>
        99%
      </text>

      {/* ---- painel direito: abstração ---- */}
      <rect x="254" y="30" width="200" height="184" rx="12" fill={panel} stroke={accent} />
      <text x="354" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill={accent}>
        Mapa (abstração)
      </text>

      <g fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round">
        <path d="M276 196 C 300 150 286 120 320 96 C 344 79 356 84 372 70" />
        <path d="M276 196 L 430 196" />
        <path d="M320 96 L 430 140" />
      </g>

      <circle cx="276" cy="196" r="7" fill="#0b1020" stroke={accent} strokeWidth="4" />
      <circle cx="372" cy="70" r="7" fill="#0b1020" stroke={accent} strokeWidth="4" />
      <circle cx="430" cy="140" r="7" fill="#0b1020" stroke={accent} strokeWidth="4" />

      <text x="296" y="188" fontSize="10" fill={muted}>
        800 m
      </text>
      <text x="392" y="112" fontSize="10" fill={muted}>
        2 km
      </text>

      <text x="354" y="208" textAnchor="middle" fontSize="11" fontWeight="700" fill={muted}>
        ruas · curvas · distâncias
      </text>
    </svg>
  )
}

/** Mapa empilhado (telas estreitas): mundo real em cima, abstração embaixo. */
export function MapArtTall({ size = 360 }: { size?: number }) {
  const { accent, muted, line, panel, warn, green } = MAP_COLORS
  return (
    <svg
      viewBox="0 0 320 480"
      role="img"
      aria-label="Mundo real cheio de detalhes acima, mapa abstrato abaixo"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      {/* ---- painel de cima: mundo real ---- */}
      <text x="160" y="18" textAnchor="middle" fontSize="15" fontWeight="700" fill={muted}>
        Mundo real
      </text>
      <rect x="12" y="26" width="296" height="186" rx="12" fill={panel} stroke={line} />

      <line x1="24" y1="120" x2="296" y2="120" stroke="#6b6f7a" strokeWidth="16" />
      <line x1="120" y1="36" x2="120" y2="202" stroke="#6b6f7a" strokeWidth="14" />
      <line x1="24" y1="112" x2="296" y2="112" stroke="#c9a24d" strokeWidth="2" opacity="0.7" />

      <g fill="#3a4252">
        <rect x="30" y="66" width="30" height="22" rx="2" />
        <polygon points="30,66 45,53 60,66" />
        <rect x="192" y="62" width="34" height="24" rx="2" />
        <polygon points="192,62 209,48 226,62" />
        <rect x="34" y="152" width="28" height="20" rx="2" />
        <polygon points="34,152 48,140 62,152" />
        <rect x="202" y="156" width="32" height="22" rx="2" />
        <polygon points="202,156 218,143 234,156" />
      </g>

      <g>
        <circle cx="96" cy="74" r="9" fill={green} />
        <rect x="94" y="82" width="4" height="8" fill="#5b4a2f" />
        <circle cx="256" cy="78" r="8" fill={green} />
        <rect x="254" y="85" width="4" height="7" fill="#5b4a2f" />
        <circle cx="86" cy="176" r="8" fill={green} />
        <rect x="84" y="183" width="4" height="7" fill="#5b4a2f" />
        <circle cx="268" cy="142" r="7" fill={green} />
        <rect x="266" y="148" width="4" height="6" fill="#5b4a2f" />
      </g>

      <g stroke={warn} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M40 178 l7 -6 l-5 -6 l8 -5" />
        <path d="M240 180 l6 -5 l-4 -7 l7 -4" />
        <path d="M150 44 l5 6 l-4 6 l6 5" />
      </g>

      <rect x="26" y="192" width="268" height="16" rx="8" fill={warn} opacity="0.18" />
      <text x="160" y="204" textAnchor="middle" fontSize="11" fontWeight="700" fill={warn}>
        1:1 — do tamanho da cidade · inútil
      </text>

      {/* ---- seta para baixo ---- */}
      <line x1="160" y1="224" x2="160" y2="258" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <polygon points="160,270 155,259 165,259" fill={accent} />
      <text x="176" y="246" fontSize="11" fontWeight="700" fill={accent}>
        filtra 99%
      </text>

      {/* ---- painel de baixo: abstração ---- */}
      <text x="160" y="292" textAnchor="middle" fontSize="15" fontWeight="700" fill={accent}>
        Mapa (abstração)
      </text>
      <rect x="12" y="300" width="296" height="170" rx="12" fill={panel} stroke={accent} />

      <g fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round">
        <path d="M70 442 C 110 392 110 368 160 356 C 210 344 230 372 288 372" />
        <path d="M70 442 L 288 442" />
        <path d="M160 356 C 190 324 230 322 288 316" />
      </g>

      <circle cx="70" cy="442" r="7" fill="#0b1020" stroke={accent} strokeWidth="4" />
      <circle cx="160" cy="356" r="7" fill="#0b1020" stroke={accent} strokeWidth="4" />
      <circle cx="288" cy="316" r="7" fill="#0b1020" stroke={accent} strokeWidth="4" />

      <text x="96" y="434" fontSize="10" fill={muted}>
        800 m
      </text>
      <text x="196" y="342" fontSize="10" fill={muted}>
        2 km
      </text>

      <text x="160" y="458" textAnchor="middle" fontSize="11" fontWeight="700" fill={muted}>
        ruas · curvas · distâncias
      </text>
    </svg>
  )
}

/**
 * Mapa da fase ABSTRAÇÃO em etapas: cada `step` mostra um estágio do caminho
 * "mundo real → abstração", para o fluxo passo a passo.
 *  0 = mundo real (1:1, inútil) · 1 = filtro de detalhes · 2 = generalizar
 *  3 = interface ≠ implementação · 4 = camadas · 5 = limites de borda
 */
export function MapStage({ step, size = 460 }: { step: number; size?: number }) {
  const { accent, muted, line, panel, warn, green } = MAP_COLORS
  const clean = step >= 1
  const street = clean ? accent : '#6b6f7a'
  return (
    <svg
      viewBox="0 0 420 250"
      role="img"
      aria-label={`Mapa — etapa ${step}`}
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      <rect x="6" y="26" width="408" height="210" rx="12" fill={panel} stroke={clean ? accent : line} />
      <text x="210" y="18" textAnchor="middle" fontSize="14" fontWeight="700" fill={clean ? accent : muted}>
        {clean ? 'Mapa (abstração)' : 'Mundo real · 1:1'}
      </text>

      {/* ---- ruído do mundo real (só na etapa 0) ---- */}
      {step === 0 && (
        <g>
          <g fill="#3a4252">
            <rect x="34" y="58" width="30" height="22" rx="2" />
            <polygon points="34,58 49,45 64,58" />
            <rect x="306" y="50" width="34" height="24" rx="2" />
            <polygon points="306,50 323,36 340,50" />
            <rect x="46" y="150" width="26" height="20" rx="2" />
            <polygon points="46,150 59,138 72,150" />
            <rect x="300" y="140" width="30" height="22" rx="2" />
            <polygon points="300,140 315,128 330,140" />
          </g>
          <g>
            <circle cx="120" cy="66" r="9" fill={green} />
            <rect x="118" y="74" width="4" height="8" fill="#5b4a2f" />
            <circle cx="230" cy="52" r="8" fill={green} />
            <rect x="228" y="59" width="4" height="7" fill="#5b4a2f" />
            <circle cx="150" cy="196" r="8" fill={green} />
            <rect x="148" y="203" width="4" height="7" fill="#5b4a2f" />
            <circle cx="272" cy="204" r="7" fill={green} />
            <rect x="270" y="210" width="4" height="6" fill="#5b4a2f" />
          </g>
          <line x1="64" y1="188" x2="352" y2="168" stroke="#c9a24d" strokeWidth="2" opacity="0.7" />
          <g stroke={warn} strokeWidth="1.4" fill="none" strokeLinecap="round">
            <path d="M186 216 l7 -6 l-5 -6 l8 -5" />
            <path d="M292 216 l6 -5 l-4 -7 l7 -4" />
          </g>
          <rect x="118" y="214" width="184" height="16" rx="8" fill={warn} opacity="0.18" />
          <text x="210" y="226" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={warn}>
            1:1 — do tamanho da cidade · inútil
          </text>
        </g>
      )}

      {/* ---- ruas / curvas ---- */}
      <g fill="none" stroke={street} strokeWidth="5" strokeLinecap="round">
        <path d="M64 196 C 96 150 140 150 196 96" />
        <path d="M196 96 C 240 130 300 150 352 176" />
        <path d="M64 196 L 352 176" />
      </g>
      <circle cx="64" cy="196" r="7" fill="#0b1020" stroke={street} strokeWidth="4" />
      <circle cx="196" cy="96" r="7" fill="#0b1020" stroke={street} strokeWidth="4" />
      <circle cx="352" cy="176" r="7" fill="#0b1020" stroke={street} strokeWidth="4" />

      {clean && (
        <>
          <text x="88" y="230" fontSize="10" fill={muted}>
            800 m
          </text>
          <text x="296" y="122" fontSize="10" fill={muted}>
            2 km
          </text>
        </>
      )}

      {/* ---- 1: filtro de detalhes (o que saiu) ---- */}
      {step === 1 && (
        <g opacity="0.55">
          <rect x="34" y="58" width="30" height="22" rx="2" fill={line} />
          <circle cx="120" cy="66" r="9" fill={line} />
          <rect x="300" y="140" width="30" height="22" rx="2" fill={line} />
          <g stroke={warn} strokeWidth="2.4" strokeLinecap="round">
            <line x1="30" y1="54" x2="68" y2="84" />
            <line x1="68" y1="54" x2="30" y2="84" />
            <line x1="110" y1="56" x2="130" y2="76" />
            <line x1="130" y1="56" x2="110" y2="76" />
            <line x1="296" y1="136" x2="334" y2="166" />
            <line x1="334" y1="136" x2="296" y2="166" />
          </g>
        </g>
      )}

      {/* ---- 2: generalizar (serve para muitos casos) ---- */}
      {step === 2 && (
        <g opacity="0.4">
          <rect x="24" y="46" width="372" height="176" rx="12" fill="none" stroke={muted} strokeDasharray="7 6" />
          <rect x="14" y="38" width="392" height="184" rx="12" fill="none" stroke={muted} strokeDasharray="7 6" />
          <text x="210" y="246" textAnchor="middle" fontSize="10" fill={muted}>
            a mesma representação serve para qualquer cidade
          </text>
        </g>
      )}

      {/* ---- 3: interface ≠ implementação (caixa-preta) ---- */}
      {step === 3 && (
        <g>
          <rect x="18" y="44" width="384" height="182" rx="12" fill="none" stroke={accent} strokeDasharray="8 6" opacity="0.85" />
          <text x="210" y="62" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={accent}>
            caixa-preta: você usa pelo que FAZ
          </text>
          <rect x="18" y="128" width="56" height="20" rx="10" fill={accent} />
          <text x="46" y="142" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0b1020">
            A → B
          </text>
          <rect x="346" y="128" width="56" height="20" rx="10" fill={accent} />
          <text x="374" y="142" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0b1020">
            trajeto
          </text>
        </g>
      )}

      {/* ---- 4: camadas ---- */}
      {step === 4 && (
        <g>
          <rect x="118" y="34" width="184" height="18" rx="6" fill="#233046" stroke={accent} />
          <text x="210" y="47" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={accent}>
            especificação → algoritmo → implementação
          </text>
        </g>
      )}

      {/* ---- 5: limites de borda ---- */}
      {step === 5 && (
        <g>
          <circle cx="196" cy="96" r="17" fill="none" stroke={warn} strokeWidth="2.5" strokeDasharray="4 4" />
          <g stroke={warn} strokeWidth="2.4" strokeLinecap="round">
            <line x1="248" y1="150" x2="278" y2="180" />
            <line x1="278" y1="150" x2="248" y2="180" />
          </g>
          <text x="263" y="198" textAnchor="middle" fontSize="10" fontWeight="700" fill={warn}>
            escada? rampa?
          </text>
        </g>
      )}
    </svg>
  )
}

/** Alterna entre o mapa horizontal (telas largas) e o empilhado (mobile). */
export function MapDiagram() {
  return (
    <>
      <div className="art-wide">
        <MapArtWide />
      </div>
      <div className="art-tall">
        <MapArtTall />
      </div>
    </>
  )
}
