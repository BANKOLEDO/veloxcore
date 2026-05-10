import { useState, useEffect, useRef } from 'react'

export function useStreamingText(fullText: string, speed = 15) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const skip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setDisplayed(fullText)
    setDone(true)
  }

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    if (!fullText) {
      setDone(true)
      return
    }

    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        const next = indexRef.current + 1
        setDisplayed(fullText.slice(0, next))
        indexRef.current = next
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setDone(true)
      }
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fullText, speed])

  return { displayed, done, skip }
}
