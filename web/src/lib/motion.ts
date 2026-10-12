import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** True when the user asked for reduced motion. Canvas effects and the intro honour it. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(QUERY).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return reduced
}
