'use client'

import { useEffect, useState } from 'react'

const WORD = 'AI.'

export default function HeroTypewriter() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Short delay before starting — lets page paint first
    const startDelay = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        setDisplayed(WORD.slice(0, i))
        if (i >= WORD.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, 120)
      return () => clearInterval(interval)
    }, 400)
    return () => clearTimeout(startDelay)
  }, [])

  return (
    <span className="text-ore">
      {displayed}
      {!done && (
        <span
          className="inline-block w-[3px] h-[0.85em] bg-ore ml-0.5 align-middle"
          style={{ animation: 'blink 0.7s step-end infinite' }}
        />
      )}
    </span>
  )
}
