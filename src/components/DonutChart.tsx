import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { AnimateProgressive } from './animated-number'

export function DonutChart() {
  const { colors } = useConfigStore()
  const { answeredQuestions } = useGameStore()
  const [percentage, setPercentage] = useState(0)

  const total =
    answeredQuestions.correct +
    answeredQuestions.incorrect +
    answeredQuestions.bonus

  useEffect(() => {
    const value =
      total > 0
        ? Math.round(
            ((answeredQuestions.correct + answeredQuestions.bonus) / total) *
              100
          )
        : 0

    setPercentage(value)
  }, [answeredQuestions.correct, answeredQuestions.bonus, total])

  return (
    <div className="relative w-20 h-20">
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={colors.wrong}
          strokeWidth="8"
          style={{ opacity: (130 - percentage) / 100 }}
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={colors.correct}
          style={{ opacity: 0.75 + (percentage / 100) * 0.25 }}
          strokeWidth="8"
          strokeDasharray={`${percentage * 2.51327} ${251.327}`}
          initial={{ strokeDasharray: '0 251.327' }}
          animate={{
            strokeDasharray: `${percentage * 2.51327} ${251.327}`,
          }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">
          <AnimateProgressive value={percentage} />%
        </span>
      </div>
    </div>
  )
}
