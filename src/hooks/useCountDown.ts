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
    if (!isActive) return

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(intervalId)
          setIsActive(false)
          setTimeout(() => onComplete(), 50) // Diferir la ejecución
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isActive, onComplete])

  return { seconds, isActive, reset, pause }
}
