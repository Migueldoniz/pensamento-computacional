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
 * - Usa a foto se houver `img`/arquivo local; senão, avatar redondo original.
 * - `pos` ajusta o ponto focal (object-position) e `zoom` dá o zoom.
 */
export function CharAvatar({
  c,
  size = 40,
  pos,
  zoom,
}: {
  c?: Character
  size?: number
  pos?: string
  zoom?: number
}) {
  const [err, setErr] = useState(false)

  const src = c?.img || (c && CHAR_IMAGES ? charImg(c) : undefined)
  const objectPosition = pos ?? c?.pos ?? '50% 20%'
  const scale = zoom ?? c?.zoom ?? 1

  if (c && src && !err) {
    return (
      <span
        style={{
          width: size,
          height: size,
          flex: 'none',
          display: 'inline-block',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0b1020',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="char-img"
          src={src}
          alt={c.name}
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            objectPosition,
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: objectPosition,
            display: 'block',
          }}
          onError={() => setErr(true)}
        />
      </span>
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
        borderRadius: '16px',
        fontSize: Math.round(size * 0.55),
        background: `linear-gradient(135deg, hsl(${h} 62% 48%), hsl(${(h + 45) % 360} 68% 30%))`,
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.18)',
      }}
    >
      {c?.emoji ?? '❓'}
    </span>
  )
}
