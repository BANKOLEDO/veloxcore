import { useState, useEffect, useRef } from 'react'

export function useStreamingText(fullText: string, speed = 15) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    if (!fullText) {
      setDone(true)
      return
    }

    const interval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        const next = indexRef.current + 1
        setDisplayed(fullText.slice(0, next))
        indexRef.current = next
      } else {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [fullText, speed])

  return { displayed, done }
}
