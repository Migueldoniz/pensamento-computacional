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

/* ===================== Analogias da Aula 2 ===================== */

const ART = {
  accent: '#4f8cff',
  muted: '#9aa4b2',
  line: '#2a313d',
  panel: '#161b24',
  warn: '#e0533d',
  ok: '#34d399',
}

/** ⚽ "Regra de jogo": comportamento + condição (requisito). */
export function GoalArt({ size = 320 }: { size?: number }) {
  const { accent, muted, line, panel, warn } = ART
  return (
    <svg
      viewBox="0 0 320 196"
      role="img"
      aria-label="Gol: a bola cruza a linha, mas se tocar a mão não vale"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      <rect x="8" y="12" width="304" height="172" rx="12" fill={panel} stroke={line} />

      <line x1="64" y1="52" x2="64" y2="132" stroke="#e7eaf0" strokeWidth="5" strokeLinecap="round" />
      <line x1="256" y1="52" x2="256" y2="132" stroke="#e7eaf0" strokeWidth="5" strokeLinecap="round" />
      <line x1="64" y1="52" x2="256" y2="52" stroke="#e7eaf0" strokeWidth="5" strokeLinecap="round" />

      <g stroke="#3a4252" strokeWidth="1.2" opacity="0.8">
        <line x1="96" y1="52" x2="96" y2="100" />
        <line x1="128" y1="52" x2="128" y2="100" />
        <line x1="192" y1="52" x2="192" y2="100" />
        <line x1="224" y1="52" x2="224" y2="100" />
        <line x1="80" y1="80" x2="240" y2="80" />
      </g>

      <line x1="160" y1="44" x2="160" y2="142" stroke={accent} strokeWidth="3" strokeDasharray="7 6" />

      <circle cx="178" cy="112" r="13" fill="#e7eaf0" />
      <polygon points="178,103 186,108 183,117 173,117 170,108" fill="#0b1020" />

      <g stroke={warn} strokeWidth="3" strokeLinecap="round">
        <line x1="204" y1="92" x2="230" y2="118" />
        <line x1="230" y1="92" x2="204" y2="118" />
      </g>
      <text x="217" y="134" textAnchor="middle" fontSize="10" fontWeight="700" fill={warn}>
        mão
      </text>

      <text x="160" y="160" textAnchor="middle" fontSize="10.5" fill={muted}>
        comportamento: cruzar a linha
      </text>
      <text x="160" y="175" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={accent}>
        condição: SE tocar a mão, não vale
      </text>
    </svg>
  )
}

/** ✈️ "Te busco no aeroporto": a suposição (pergunta que ninguém fez). */
export function AirportArt({ size = 320 }: { size?: number }) {
  const { accent, muted, line, panel, warn } = ART
  return (
    <svg
      viewBox="0 0 320 196"
      role="img"
      aria-label="Pessoa com cartaz no aeroporto e perguntas não feitas"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      <rect x="8" y="12" width="304" height="172" rx="12" fill={panel} stroke={line} />

      <rect x="24" y="34" width="188" height="58" rx="10" fill="#1e242e" stroke={accent} strokeWidth="2" />
      <text x="118" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="#e7eaf0">
        TE BUSCO
      </text>
      <text x="118" y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill={accent}>
        NO AEROPORTO
      </text>

      <circle cx="48" cy="126" r="13" fill={muted} />
      <rect x="33" y="142" width="30" height="30" rx="12" fill={muted} />
      <line x1="48" y1="94" x2="48" y2="120" stroke={muted} strokeWidth="3" strokeLinecap="round" />

      <text x="236" y="58" fontSize="11" fontWeight="700" fill={warn}>
        terminal?
      </text>
      <text x="236" y="82" fontSize="11" fontWeight="700" fill={warn}>
        horário?
      </text>
      <text x="236" y="106" fontSize="11" fontWeight="700" fill={warn}>
        voo?
      </text>
      <text x="266" y="150" fontSize="26" fill={warn}>
        ?
      </text>

      <text x="160" y="176" textAnchor="middle" fontSize="10.5" fill={muted}>
        ninguém perguntou → a suposição quebra o encontro
      </text>
    </svg>
  )
}

/** 📦 "Pedido de delivery": o ciclo de vida (estado). */
export function DeliveryArt({ size = 380 }: { size?: number }) {
  const { accent, muted, line, panel, warn, ok } = ART
  const node = (x: number, label: string, color: string) => (
    <g key={label}>
      <circle cx={x} cy="62" r="9" fill={color} />
      <text x={x} y="92" textAnchor="middle" fontSize="10" fill={muted}>
        {label}
      </text>
    </g>
  )
  return (
    <svg
      viewBox="0 0 380 150"
      role="img"
      aria-label="Pedido de delivery: recebido, preparando, a caminho, entregue; cancelado"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      <rect x="8" y="12" width="364" height="126" rx="12" fill={panel} stroke={line} />

      <line x1="50" y1="62" x2="330" y2="62" stroke={line} strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="62" x2="230" y2="62" stroke={ok} strokeWidth="4" strokeLinecap="round" />

      {node(50, 'recebido', ok)}
      {node(140, 'preparando', ok)}
      {node(230, 'a caminho', accent)}
      {node(330, 'entregue', '#3a4252')}

      <line
        x1="140"
        y1="71"
        x2="140"
        y2="104"
        stroke={warn}
        strokeWidth="2.5"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <circle cx="140" cy="112" r="7" fill="none" stroke={warn} strokeWidth="2.5" />
      <text x="140" y="116" textAnchor="middle" fontSize="9" fontWeight="700" fill={warn}>
        ✕
      </text>
      <text x="158" y="116" fontSize="10" fill={warn}>
        cancelado
      </text>

      <text x="190" y="136" textAnchor="middle" fontSize="10.5" fill={muted}>
        “no carrinho” não reserva · “pago/aprovado” reserva
      </text>
    </svg>
  )
}

/** ✅ "Arruma o quarto": o que dá para verificar (requisito verificável). */
export function ChecklistArt({ size = 360 }: { size?: number }) {
  const { accent, muted, line, panel, warn, ok } = ART
  return (
    <svg
      viewBox="0 0 360 160"
      role="img"
      aria-label="Arruma o quarto (vago) versus uma lista de itens conferíveis"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      {/* vago */}
      <rect x="8" y="12" width="156" height="136" rx="12" fill={panel} stroke={warn} />
      <text x="86" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill={warn}>
        “arruma o quarto”
      </text>
      <text x="86" y="86" textAnchor="middle" fontSize="42" fill={warn}>
        ?
      </text>
      <text x="86" y="122" textAnchor="middle" fontSize="10" fill={muted}>
        dá para conferir? não
      </text>

      {/* verificável */}
      <rect x="196" y="12" width="156" height="136" rx="12" fill={panel} stroke={ok} />
      <text x="274" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill={ok}>
        “arruma o quarto”
      </text>
      <g fontSize="10" fill="#e7eaf0">
        <rect x="212" y="50" width="12" height="12" rx="3" fill="none" stroke={ok} strokeWidth="2" />
        <path d="M214 56 L218 60 L223 52" fill="none" stroke={ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="232" y="60">roupa no armário</text>

        <rect x="212" y="74" width="12" height="12" rx="3" fill="none" stroke={ok} strokeWidth="2" />
        <path d="M214 80 L218 84 L223 76" fill="none" stroke={ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="232" y="84">lixo na lixeira</text>

        <rect x="212" y="98" width="12" height="12" rx="3" fill="none" stroke={ok} strokeWidth="2" />
        <path d="M214 104 L218 108 L223 100" fill="none" stroke={ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="232" y="108">cama esticada</text>
      </g>
      <text x="274" y="134" textAnchor="middle" fontSize="10" fontWeight="700" fill={ok}>
        dá para conferir? sim
      </text>
    </svg>
  )
}

/** 🪜 "Níveis de abstração": problema → algoritmo → programa → execução. */
export function LevelsArt({ size = 380 }: { size?: number }) {
  const { accent, muted, line, panel, ok } = ART
  const levels = [
    { n: '1', label: 'Problema', q: 'o que é necessário?', color: accent },
    { n: '2', label: 'Algoritmo', q: 'o que deve fazer?', color: accent },
    { n: '3', label: 'Programa', q: 'como é feito?', color: muted },
    { n: '4', label: 'Execução', q: 'o que faz?', color: ok },
  ]
  return (
    <svg
      viewBox="0 0 380 300"
      role="img"
      aria-label="Quatro níveis: problema, algoritmo, programa, execução"
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', margin: '0 auto' }}
    >
      <rect x="8" y="10" width="364" height="280" rx="12" fill={panel} stroke={line} />

      {/* eixo */}
      <line x1="30" y1="46" x2="30" y2="254" stroke={muted} strokeWidth="2" strokeDasharray="4 4" />
      <text x="30" y="36" textAnchor="middle" fontSize="8.5" fill={muted}>
        abstrato
      </text>
      <text x="30" y="270" textAnchor="middle" fontSize="8.5" fill={muted}>
        concreto
      </text>

      {levels.map((l, i) => {
        const y = 34 + i * 58
        return (
          <g key={l.n}>
            <rect x="54" y={y} width="300" height="48" rx="10" fill="#1e242e" stroke={l.color} strokeWidth="1.6" />
            <circle cx="76" cy={y + 24} r="11" fill={l.color} />
            <text x="76" y={y + 28} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0b1020">
              {l.n}
            </text>
            <text x="96" y={y + 20} fontSize="12" fontWeight="700" fill="#e7eaf0">
              {l.label}
            </text>
            <text x="96" y={y + 36} fontSize="10" fill={muted}>
              {l.q}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Renderiza uma analogia pelo nome. */
export function AnalogyArt({ kind }: { kind: string }) {
  if (kind === 'goal') return <GoalArt />
  if (kind === 'airport') return <AirportArt />
  if (kind === 'delivery') return <DeliveryArt />
  if (kind === 'checklist') return <ChecklistArt />
  if (kind === 'levels') return <LevelsArt />
  return null
}
