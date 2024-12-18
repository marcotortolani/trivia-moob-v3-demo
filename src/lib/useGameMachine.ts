import { useState } from 'react'

interface UseGameMachineReturn {
  state: string
  handleAnswer: (isCorrect: boolean) => void
  handleCloseModal: () => void
  handleChangeCategory: () => void
  handleDontAskAgain: () => void
}

export const useGameMachine = (): UseGameMachineReturn => {
  const [state, setState] = useState('answering') // Estado inicial
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [recentAnswers, setRecentAnswers] = useState<string[]>([])
  const [dontAskAgain, setDontAskAgain] = useState(false)

  const transition = (nextState: string) => setState(nextState)

  const handleAnswer = (isCorrect: boolean) => {
    setQuestionsAnswered((prev) => prev + 1)

    const newAnswers = [
      ...recentAnswers.slice(-2), // Últimos dos elementos
      isCorrect ? 'correct' : 'incorrect',
    ]
    setRecentAnswers(newAnswers)

    // Reglas para transiciones
    const last3 = newAnswers.slice(-3)
    if (
      last3.length === 3 &&
      (last3.every((a) => a === 'correct') ||
        last3.every((a) => a === 'incorrect'))
    ) {
      transition('encouragingMessage')
    } else if (!dontAskAgain && (questionsAnswered + 1) % 3 === 0) {
      transition('changeCategory')
    } else {
      transition('answering')
    }
  }

  const handleCloseModal = () => transition('checkingState')

  const handleChangeCategory = () => transition('answering')

  const handleDontAskAgain = () => {
    setDontAskAgain(true)
    transition('answering')
  }

  return {
    state,
    handleAnswer,
    handleCloseModal,
    handleChangeCategory,
    handleDontAskAgain,
  }
}
