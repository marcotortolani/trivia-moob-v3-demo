import { useMemo } from 'react'
import { useGameStore } from '@/lib/game-store'

export const useQuestionsAnswered = (categoryID?: number) => {
  const { categoriesState } = useGameStore()

  const totalQuestions = useMemo(() => {
    return (
      categoriesState?.find((category) => category.id === categoryID)?.questions
        .length ?? 0
    )
  }, [categoriesState, categoryID])

  const questionsAnswered = useMemo(() => {
    return (
      categoriesState
        ?.find((category) => category.id === categoryID)
        ?.questions.reduce(
          (acc, question) => acc + (question.completed ? 1 : 0),
          0
        ) ?? 0
    )
  }, [categoriesState, categoryID])

  return {
    questionsAnswered,
    totalQuestions,
  }
}
