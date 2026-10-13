'use client'

import { useState } from 'react'
import { CHAR_IMAGES, charImg, type Character } from '@/lib/characters'

function hue(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h % 360
}

/**
 * Avatar do personagem.
 * - Se `CHAR_IMAGES` estiver ligado e houver foto em `/public/chars/<id>`, usa a foto.
 * - Caso contrário, desenha um avatar redondo original (cor única + emoji).
 */
export function CharAvatar({ c, size = 40 }: { c?: Character; size?: number }) {
  const [err, setErr] = useState(false)

  if (c && CHAR_IMAGES && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="char-img"
        src={charImg(c)}
        alt={c.name}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flex: 'none' }}
        onError={() => setErr(true)}
      />
    )
  }

  const h = c ? hue(c.id) : 210
  return (
    <span
      className="char-emoji"
      style={{
        width: size,
        height: size,
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        fontSize: Math.round(size * 0.55),
        background: `linear-gradient(135deg, hsl(${h} 62% 48%), hsl(${(h + 45) % 360} 68% 30%))`,
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.18)',
      }}
    >
      {c?.emoji ?? '❓'}
    </span>
  )
}
