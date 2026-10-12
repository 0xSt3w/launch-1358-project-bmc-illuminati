import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../config/brand'
import { useReducedMotion } from '../lib/motion'
import { Emblem } from './Emblem'
import { MatrixRain } from './MatrixRain'

const KEY = 'bmc-intro-seen'
const DURATION_MS = 3200
const SCRAMBLE = '01∆ΣΩ#%&ABCDEF'

/**
 * Short, skippable cinematic intro: falling code decodes the brand name and
 * reveals the emblem. Plays once per browser session. Skipped entirely under
 * reduced motion. Escape, Enter or the Skip button end it immediately.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [text, setText] = useState('')
  const skipRef = useRef<HTMLButtonElement>(null)
  const finished = useRef(false)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* storage may be unavailable; the intro simply replays next time */
    }
    onDone()
  }

  useEffect(() => {
    if (reduced) {
      finish()
      return
    }
    skipRef.current?.focus()
    const target = BRAND.nameUpper
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1600)
      const revealed = Math.floor(p * target.length)
      let out = ''
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') out += ' '
        else if (i < revealed) out += target[i]
        else out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }
      setText(out)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setText(target)
    }
    raf = requestAnimationFrame(tick)
    const timer = window.setTimeout(finish, DURATION_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  if (reduced) return null

  return (
    <div className="intro" role="dialog" aria-modal="true" aria-label="Intro animation">
      <MatrixRain intensity={0.9} dense />
      <div className="intro-center">
        <Emblem variant="pyramid" animated />
        <p className="intro-title" aria-live="off">
          {text || ' '}
        </p>
        <p className="visually-hidden">{BRAND.nameUpper}. Loading the encrypted gateway.</p>
      </div>
      <button ref={skipRef} type="button" className="btn btn-secondary btn-sm intro-skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  )
}

export function introAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
