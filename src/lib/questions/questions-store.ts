import { create } from 'zustand'
import { Question } from '@/types/game-types'

export interface GameState {
  currentState: 'START' | 'PLAYING' | 'PAUSE' | 'CAT_FINISHED'
  message?: string
  dontAskAgain?: boolean
}
interface QuestionState {
  gameState: GameState
  showExtraPoints: boolean
  currentQuestion: Question | null
  answerSelected: number | null
  amountQuestionsAnswered: number
  cardDirection: number
  setGameState: (partialState: Partial<QuestionState['gameState']>) => void
  setShowExtraPoints: (show: boolean) => void
  setCurrentQuestion: (question: Question) => void
  setAnswerSelected: (index: number | null) => void
  setAmountQuestionsAnswered: (amount: number) => void
  setCardDirection: (direction: number) => void
  resetAmountQuestionsAnswered: () => void
  resetGameState: () => void
}

export const useQuestionStore = create<QuestionState>()((set) => ({
  gameState: {
    currentState: 'START',
    message: '',
    dontAskAgain: false,
  },
  showExtraPoints: false,
  currentQuestion: null,
  answerSelected: null,
  amountQuestionsAnswered: 0,
  cardDirection: 0,
  setGameState: (partialState) =>
    set((state) => ({
      gameState: { ...state.gameState, ...partialState },
    })),
  setShowExtraPoints: (show: boolean) => set({ showExtraPoints: show }),
  setCurrentQuestion: (question: Question) =>
    set({ currentQuestion: question }),
  setAnswerSelected: (index: number | null) => set({ answerSelected: index }),
  setAmountQuestionsAnswered: (amount: number) =>
    set({ amountQuestionsAnswered: amount }),
  setCardDirection: (direction: number) => set({ cardDirection: direction }),
  resetAmountQuestionsAnswered: () => set({ amountQuestionsAnswered: 0 }),
  resetGameState: () =>
    set({
      gameState: {
        currentState: 'START',
        message: '',
        dontAskAgain: false,
      },
    }),
}))
