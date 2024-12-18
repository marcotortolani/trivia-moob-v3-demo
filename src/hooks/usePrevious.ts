import { useRef, useEffect } from 'react'

export function useInterval(callback: Function, delay: number | null) {
  const savedCallback = useRef<Function>()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  })
  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (typeof savedCallback?.current === 'function') {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export function usePrevious(value: any) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
