import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Animated integer. Screen readers get the final value immediately. */
export default function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? value : 0)
  const from = useRef(0)

  useEffect(() => {
    if (reduced) {
      setShown(value)
      return
    }
    const start = from.current
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(start + (value - start) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, reduced])

  return (
    <>
      <span aria-hidden="true">{shown}{suffix}</span>
      <span className="sr-only">{value}{suffix}</span>
    </>
  )
}
