// hooks/useScoreManager.ts
import { useState, useCallback } from 'react'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
//import { updateEndpointScore } from '@/services/updateEndpointScore'
type AnswerType = 'correct' | 'incorrect' | 'bonus'

export function useScoreManager() {
  const { score, incrementScore } = useGameStore()
  const { config } = useConfigStore()
  const { pointsCorrect, pointsWrong, pointsBonus } = config
  const [recentAnswers, setRecentAnswers] = useState<AnswerType[]>([])

  const calculateScore = useCallback(
    (
      isCorrect: boolean,
      secondsLeft: number,
      questionHasBonus: boolean,
      categoryHasBonus: boolean
    ) => {
      const timeBonus = secondsLeft * 10

      if (isCorrect) {
        if (questionHasBonus || categoryHasBonus) {
          return pointsCorrect + pointsBonus + timeBonus
        }
        return pointsCorrect + timeBonus
      }

      return pointsWrong + timeBonus
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const updateScore = useCallback((points: number) => {
    incrementScore(points)
    
    // TODO Update Endpoint Score
    //updateEndpointScore({ partialScore: points })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addRecentAnswer = useCallback((answer: AnswerType) => {
    setRecentAnswers((prev) => {
      const newAnswers = [...prev, answer]
      return newAnswers.slice(-12) // Mantener solo los últimos 12
    })
  }, [])

  return {
    score,
    recentAnswers,
    calculateScore,
    updateScore,
    addRecentAnswer,
  }
}
