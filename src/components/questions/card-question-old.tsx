'use client'

import { motion } from 'framer-motion'
import { Question } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'

interface CardQuestionProps {
  question: Question
  categoryHasBonus: boolean
  onAnswerSelect: (index: number) => void
  selectedAnswer: number | null
  timeUp: boolean
  children: React.ReactNode
}

export function CardQuestion({
  question,
  categoryHasBonus,
  onAnswerSelect,
  selectedAnswer,
  timeUp,
  children,
}: CardQuestionProps) {
  const { config } = useConfigStore()
  const { pointsCorrect, pointsWrong, pointsBonus } = config

  return (
    <motion.div
      initial={{ x: '-200%' }}
      animate={{
        x: timeUp ? [0, -10, 10, -10, 10, 0] : 0,
        transition: { duration: 0.5 },
        backgroundColor: timeUp ? '#ef4444' : '#1f2937',
      }}
      exit={{ x: '200%' }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 30,
        duration: 0.25,
      }}
      className={`relative rounded-lg p-6 shadow-lg ${
        timeUp ? ' animate-shake ' : ''
      }`}
    >
      {children}
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        {question.title}
      </h2>

      <div className="grid gap-4">
        {question.answers.map((answer, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={selectedAnswer !== null || timeUp}
            className={`h-16 text-xl rounded-lg ${
              selectedAnswer === index
                ? answer.isCorrect
                  ? 'bg-green-400 hover:bg-green-600'
                  : 'bg-red-400 hover:bg-red-600 disabled:bg-red-500'
                : 'bg-blue-400 hover:bg-blue-700 disabled:bg-gray-500 '
            } text-white transition-all duration-100 ease-in-out `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: selectedAnswer !== null ? 1 : 0.95 }}
            animate={
              selectedAnswer === index
                ? answer.isCorrect
                  ? {
                      scale: [1, 1.2, 1, 0.9, 1, 1.2, 1],
                      transition: { duration: 0.5 },
                    }
                  : {
                      x: [0, -10, 10, -10, 10, 0],
                      transition: { duration: 0.5 },
                    }
                : {}
            }
          >
            {selectedAnswer === index
              ? answer.isCorrect
                ? question.bonus || categoryHasBonus
                  ? `Extra Bonus: +${pointsCorrect + pointsBonus}`
                  : `Correcta: +${pointsCorrect}`
                : `Incorrecta: +${pointsWrong}`
              : answer.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
