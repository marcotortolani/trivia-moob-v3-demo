import { useState, useEffect, useCallback } from 'react'

export function useCountdown(initialSeconds: number, onComplete: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(true)

  const reset = useCallback(() => {
    setSeconds(initialSeconds)
    setIsActive(true)
  }, [initialSeconds])

  const pause = useCallback(() => {
    setIsActive(false)
  }, [])


  useEffect(() => {
    if (!isActive || seconds <= 0) return

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1)
    }, 1000)

    if (seconds === 0) {
      setIsActive(false)
      onComplete()
    }

    return () => clearInterval(intervalId)
  }, [isActive, seconds])

  return { seconds, isActive, reset, pause }
}
