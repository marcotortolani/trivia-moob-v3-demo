import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import { AnimateSwitch } from './animated-number'
import { useConfigStore } from '@/lib/config-store'

interface TimerProps {
  secondsLeft: number
  isActive: boolean
  showExtraPoints?: boolean
}

export function Timer({
  secondsLeft,
  isActive,
  showExtraPoints = false,
}: TimerProps) {
  const { colors } = useConfigStore()
  const [extraPoints, setExtraPoints] = useState(0)

  useEffect(() => {
    if (showExtraPoints && secondsLeft > 0) {
      setExtraPoints(secondsLeft * 10)
    }
  }, [showExtraPoints, secondsLeft])

  return (
    <div className="relative flex items-center space-x-2 shadow-md shadow-black/10">
      <AnimatePresence>
        {showExtraPoints && extraPoints > 0 && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: -25 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className=" z-20 absolute top-0 left-2 text-nowrap text-green-500 font-oswaldBold italic tracking-wide"
          >
            +{extraPoints} pts
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={` z-50 px-2 py-0.5 flex items-center gap-2 text-lg rounded-lg ${
          isActive ? 'bg-neutral-300 text-neutral-800' : 'bg-red-600'
        }`}
        style={{ color: !isActive ? colors.text : '' }}
      >
        <Clock className="w-5 h-5" />
        <AnimateSwitch value={secondsLeft || 0} />
      </div>
    </div>
  )
}
