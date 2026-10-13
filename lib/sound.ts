'use client'

let ctx: AudioContext | null = null
let muted = false
let inited = false

export function initSound() {
  if (inited || typeof window === 'undefined') return
  inited = true
  try {
    muted = localStorage.getItem('oa_muted') === '1'
  } catch {
    /* ignore */
  }
}

export function isMuted() {
  return muted
}

export function setMuted(m: boolean) {
  muted = m
  try {
    localStorage.setItem('oa_muted', m ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext || (window as any).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function beep(freq: number, dur = 0.12, type: OscillatorType = 'sine', vol = 0.15, when = 0) {
  const a = ac()
  if (!a || muted) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.value = freq
  o.connect(g)
  g.connect(a.destination)
  const t = a.currentTime + when
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(vol, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.start(t)
  o.stop(t + dur + 0.03)
}

export function sfxCorrect() {
  beep(660, 0.12, 'triangle', 0.16, 0)
  beep(880, 0.16, 'triangle', 0.16, 0.12)
}

export function sfxWrong() {
  beep(220, 0.22, 'sawtooth', 0.13, 0)
  beep(150, 0.28, 'sawtooth', 0.13, 0.1)
}

export function sfxStart() {
  beep(520, 0.09, 'square', 0.12, 0)
  beep(780, 0.11, 'square', 0.12, 0.09)
}

export function sfxTick() {
  beep(1100, 0.04, 'square', 0.07)
}

export function sfxClick() {
  beep(640, 0.05, 'square', 0.08)
}

export function sfxWin() {
  beep(660, 0.1, 'triangle', 0.16, 0)
  beep(880, 0.1, 'triangle', 0.16, 0.1)
  beep(1320, 0.2, 'triangle', 0.16, 0.2)
}
