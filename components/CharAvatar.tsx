'use client'

import { useState } from 'react'
import { CHAR_IMAGES, charImg, type Character } from '@/lib/characters'

/**
 * Mostra a foto do personagem se `CHAR_IMAGES` estiver ligado e o arquivo
 * existir; caso contrário, cai no emoji.
 */
export function CharAvatar({ c, size = 40 }: { c?: Character; size?: number }) {
  const [err, setErr] = useState(false)
  const fontSize = Math.round(size * 0.62)

  if (!c || !CHAR_IMAGES || err) {
    return (
      <span
        className="char-emoji"
        style={{ fontSize, width: size, height: size, lineHeight: `${size}px`, textAlign: 'center', display: 'inline-block' }}
      >
        {c?.emoji ?? '❓'}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="char-img"
      src={charImg(c)}
      alt={c.name}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: 8, objectFit: 'cover', flex: 'none' }}
      onError={() => setErr(true)}
    />
  )
}
