'use client'

import { useEffect, useState } from 'react'

const WORDS = ['locally.', 'privately.', 'on-device.', 'offline.', 'forever.']
const TYPE_SPEED = 80
const DELETE_SPEED = 45
const PAUSE_AFTER = 1800
const PAUSE_BEFORE = 300

export default function HeroTypewriter() {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [typing, setTyping] = useState(true)
  const [pausing, setPausing] = useState(false)

  useEffect(() => {
    if (pausing) return
    const word = WORDS[wordIdx]
    if (typing) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), TYPE_SPEED)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => { setTyping(false); setPausing(true) }, PAUSE_AFTER)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETE_SPEED)
        return () => clearTimeout(t)
      } else {
        const nextIdx = (wordIdx + 1) % WORDS.length
        const t = setTimeout(() => {
          setWordIdx(nextIdx)
          setTyping(true)
          setPausing(false)
        }, PAUSE_BEFORE)
        return () => clearTimeout(t)
      }
    }
  }, [displayed, typing, pausing, wordIdx])

  useEffect(() => {
    if (!pausing) return
    const t = setTimeout(() => setPausing(false), 0)
    return () => clearTimeout(t)
  }, [pausing])

  const isActive = typing && displayed.length < WORDS[wordIdx].length

  return (
    <span className="text-ore" aria-live="polite" aria-atomic="true">
      {displayed}
      <span
        className="inline-block w-[3px] h-[0.85em] bg-ore ml-0.5 align-middle"
        style={{ animation: isActive ? 'blink 0.7s step-end infinite' : 'none', opacity: isActive ? 1 : 0.6 }}
        aria-hidden="true"
      />
    </span>
  )
}
