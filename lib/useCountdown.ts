'use client'

import { useEffect, useState } from 'react'

/**
 * Segundos restantes até `deadline` (epoch ms), corrigido pelo desvio entre o
 * relógio do servidor e o do cliente (`offset = serverNow - clientNow`).
 * Retorna null quando não há cronômetro ativo.
 */
export function useCountdown(deadline: number | null, offset: number) {
  const [tick, setTick] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setTick(Date.now()), 250)
    return () => clearInterval(t)
  }, [])
  if (deadline == null) return null
  const ms = deadline - (tick + offset)
  return Math.max(0, Math.ceil(ms / 1000))
}
