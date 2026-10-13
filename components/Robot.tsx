'use client'

export type Mood = 'idle' | 'thinking' | 'correct' | 'wrong'

const COLORS: Record<Mood, string> = {
  idle: '#4f8cff',
  thinking: '#ffcc4d',
  correct: '#2ecc71',
  wrong: '#ff5c6c',
}

export function Robot({ mood, size = 220 }: { mood: Mood; size?: number }) {
  const c = COLORS[mood]
  const eye = mood === 'wrong' ? '×' : mood === 'correct' ? '^' : 'o'
  const mouth =
    mood === 'correct' ? 'M 70 128 Q 100 152 130 128'
    : mood === 'wrong' ? 'M 70 140 Q 100 118 130 140'
    : 'M 74 134 L 126 134'

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Robô ${mood}`}>
      <rect x="18" y="18" width="164" height="164" rx="28" fill="#101735" stroke={c} strokeWidth="4" />
      {/* antenna */}
      <line x1="100" y1="18" x2="100" y2="4" stroke={c} strokeWidth="4" />
      <circle cx="100" cy="4" r="6" fill={c} />
      {/* eyes */}
      <circle cx="70" cy="80" r="14" fill="#0b1020" stroke={c} strokeWidth="3" />
      <circle cx="130" cy="80" r="14" fill="#0b1020" stroke={c} strokeWidth="3" />
      <text x="70" y="88" textAnchor="middle" fontSize="20" fill={c} fontFamily="monospace">
        {eye}
      </text>
      <text x="130" y="88" textAnchor="middle" fontSize="20" fill={c} fontFamily="monospace">
        {eye}
      </text>
      {/* mouth */}
      <path d={mouth} fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {/* chest light */}
      <circle cx="100" cy="160" r="7" fill={c} opacity="0.8" />
    </svg>
  )
}
