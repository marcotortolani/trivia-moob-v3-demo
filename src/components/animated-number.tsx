import { useEffect, useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

export function AnimateProgressive({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const springValue = useSpring(displayValue, { stiffness: 100, damping: 30 })

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return <motion.span>{displayValue}</motion.span>
}

// -----------
function formatForDisplay(number = 0): string[] {
  return Math.max(Math.round(number), 0).toString().split('').reverse()
}

function DecimalColumn() {
  return (
    <div>
      <span>.</span>
    </div>
  )
}

function NumberColumn({ digit }: { digit: string }) {
  const [position, setPosition] = useState(0)
  const columnContainer = useRef<HTMLDivElement | null>(null)

  const setColumnToNumber = (number: string) => {
    if (columnContainer.current) {
      const height = columnContainer.current.clientHeight
      setPosition(height * parseInt(number, 10))
    }
  }

  useEffect(() => {
    setColumnToNumber(digit)
  }, [digit])

  return (
    <div className="relative" ref={columnContainer}>
      <motion.div animate={{ y: position }} className={`absolute bottom-0 `}>
        {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((num) => (
          <div key={num} className="h-[10%] ">
            <span>{num}</span>
          </div>
        ))}
      </motion.div>
      <span className="opacity-0 ">0</span>
    </div>
  )
}

export function AnimateSwitch({ value }: { value: number }) {
  const numArray = formatForDisplay(value)

  return (
    <motion.div
      layout
      className="relative m-auto h-full flex flex-row-reverse font-oswaldRegular  overflow-hidden"
    >
      {numArray.map((number, index) =>
        number === '.' ? (
          <DecimalColumn key={index} />
        ) : (
          <NumberColumn key={index} digit={number} />
        )
      )}
    </motion.div>
  )
}
