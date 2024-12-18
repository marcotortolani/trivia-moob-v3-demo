// hooks/useQuestionManager.ts
import { useState, useEffect, useCallback } from 'react'
import { Question, Category } from '../types/game-types'
import ENCOURAGING_MESSAGES from '@/data/encouraging-messages.json'

type ValidSizes = keyof (typeof ENCOURAGING_MESSAGES)['correct' | 'incorrect']
interface GameConfig {
  countdownSeconds: number
  amountAnswersToChangeCategory: number
}

export function useQuestionManager(categories: Category[], config: GameConfig) {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  console.log('config', config)

  useEffect(() => {
    if (categories.length > 0) {
      const firstCategory = categories[0]
      setCurrentCategory(firstCategory)
      setCurrentQuestion(firstCategory.questions[0])
    }
  }, [categories])

  const selectCategory = useCallback(
    (categoryId: number) => {
      const category = categories.find((cat) => cat.id === categoryId)
      if (category) {
        setCurrentCategory(category)
        setCurrentQuestion(category.questions[0])
        setCurrentQuestionIndex(0)
        setQuestionsAnswered(0)
      }
    },
    [categories]
  )

  const nextQuestion = useCallback(() => {
    console.log('nextQuestion')
    console.log('currentCategory', currentCategory)

    if (!currentCategory) return null

    const newIndex = currentQuestionIndex + 1
    if (newIndex < currentCategory.questions.length) {
      console.log('set next question')
      console.log('newIndex', newIndex)

      setCurrentQuestionIndex(newIndex)
      setCurrentQuestion(currentCategory.questions[newIndex])
      setQuestionsAnswered((prev) => prev + 1)
      return currentCategory.questions[newIndex]
    }
    return null
  }, [currentCategory, currentQuestionIndex])

  const getEncouragingMessage = useCallback((recentAnswers: string[]) => {
    const relevantSizes = [12, 10, 7, 5, 3]

    for (const size of relevantSizes) {
      if (recentAnswers.length >= size) {
        const recentSlice = recentAnswers.slice(-size)

        const messageType = recentSlice.every((answer) => answer === 'correct')
          ? 'correct'
          : recentSlice.every((answer) => answer === 'incorrect')
          ? 'incorrect'
          : null

        if (messageType) {
          const key = size.toString() as ValidSizes
          return ENCOURAGING_MESSAGES[messageType][key]
        }
      }
    }

    return null
  }, [])

  return {
    currentCategory,
    currentQuestion,
    questionsAnswered,
    selectCategory,
    nextQuestion,
    getEncouragingMessage,
  }
}
