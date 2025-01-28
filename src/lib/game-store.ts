import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Question, Category } from '@/types/type-config-data'
import { encryptData, decryptData } from '@/services/encryptData'

import configDataInitial from '@/data/configDataInitial.json'
const { categories } = configDataInitial

const categoriesStateInitial = categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  completed: false,
  questions: cat.questions.map((q) => ({ id: q.id, completed: false })),
}))

export interface CategoryState {
  id: number
  name: string
  completed: boolean
  questions: { id: number; completed: boolean }[]
}

export interface SelectedCategory {
  id: number
  name: string
  bonus: boolean
  image: string
}

interface AnsweredQuestions {
  correct: number
  incorrect: number
  bonus: number
}
type AnswerType = 'correct' | 'incorrect' | 'bonus'

interface GameState {
  categoriesState: CategoryState[]
  selectedCategory: SelectedCategory
  score: number
  answeredQuestions: AnsweredQuestions
  timeSpent: number
  questions: string

  updateCategoriesState: (categoryID: number, questionID: number) => void
  setSelectedCategory: ({
    id,
    name,
    bonus,
  }: {
    id: number
    name: string
    bonus: boolean
    image: string
  }) => void
  setQuestions: (questions: Question[]) => void
  getQuestions: () => Question[]
  incrementScore: (points: number) => void
  updateAnsweredQuestions: (answerType: AnswerType) => void
  updateTimeSpent: (time: number) => void
  syncCategoriesState: (updatedCategories: Category[]) => void
  resetGame: () => void
}

const answeredQuestionsInitial = {
  correct: 0,
  incorrect: 0,
  bonus: 0,
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => {
      const gameStorage = JSON.parse(
        localStorage.getItem('game-storage') || '{}'
      )

      return {
        categoriesState:
          gameStorage?.state?.categoriesState || categoriesStateInitial,
        selectedCategory: gameStorage?.state?.selectedCategory || {
          id: 0,
          name: '',
          bonus: false,
          image: '',
        },
        score: gameStorage?.state?.score || 0,
        answeredQuestions:
          gameStorage?.state?.answeredQuestionsInitial ||
          answeredQuestionsInitial,
        timeSpent: 0,
        questions: gameStorage?.state?.questions || '',
        updateCategoriesState: (categoryID, questionID) =>
          set((state) => ({
            categoriesState: state.categoriesState.map((cat) => {
              if (cat.id === categoryID) {
                // Actualizar las preguntas de la categoría.
                const updatedQuestions = cat.questions.map((q) => {
                  if (q.id === questionID) {
                    return { ...q, completed: true }
                  }
                  return q
                })

                // Verificar si todas las preguntas están completadas después de la actualización.
                const isCategoryCompleted = updatedQuestions.every(
                  (q) => q.completed
                )

                // Solo actualizar el estado de completado si ha cambiado.
                if (cat.completed !== isCategoryCompleted) {
                  return {
                    ...cat,
                    questions: updatedQuestions,
                    completed: isCategoryCompleted, // Actualizar el estado de la categoría solo si cambia.
                  }
                }

                // Si no hay cambios en el estado de completado, no recalcular.
                return {
                  ...cat,
                  questions: updatedQuestions,
                }
              }
              return cat // Si no es la categoría objetivo, no la modifica.
            }),
          })),
        setSelectedCategory: (category: {
          id: number
          name: string
          bonus: boolean
          image: string
        }) => set({ selectedCategory: category }),
        // setQuestions: (questions) => set({ questions }),
        setQuestions: (questions: Question[]) => {
          const encryptedQuestions = encryptData(questions) || ''
          set({ questions: encryptedQuestions })
        },
        getQuestions: () => {
          const state = useGameStore.getState()
          try {
            const decryptedQuestions = decryptData(state.questions)
            return decryptedQuestions
          } catch (error) {
            console.error('Error while decrypting questions:', error)
            return []
          }
        },
        incrementScore: (points: number) =>
          set((state) => ({ score: state.score + points })),
        updateAnsweredQuestions: (answerType: AnswerType) =>
          set((state) => ({
            answeredQuestions: {
              correct:
                state.answeredQuestions.correct +
                (answerType === 'correct' ? 1 : 0),
              incorrect:
                state.answeredQuestions.incorrect +
                (answerType === 'incorrect' ? 1 : 0),
              bonus:
                state.answeredQuestions.bonus +
                (answerType === 'bonus' ? 1 : 0),
            },
          })),
        updateTimeSpent: (time: number) => set({ timeSpent: time }),
        syncCategoriesState: (updatedCategories: Category[]) =>
          set((state) => ({
            categoriesState: updatedCategories.map((updatedCat) => {
              const existingCategory = state.categoriesState.find(
                (cat) => cat.id === updatedCat.id
              )

              if (existingCategory) {
                // Sincroniza las preguntas existentes y agrega las nuevas
                const syncedQuestions = updatedCat.questions.map(
                  (newQuestion) => {
                    const existingQuestion = existingCategory.questions.find(
                      (q) => q.id === newQuestion.id
                    )
                    return (
                      existingQuestion || {
                        id: newQuestion.id,
                        completed: false,
                      }
                    )
                  }
                )

                // Actualiza el estado de la categoría
                return {
                  ...existingCategory,
                  name: updatedCat.name, // Si el nombre cambió
                  questions: syncedQuestions,
                  completed: syncedQuestions.every((q) => q.completed),
                }
              }

              // Si es una nueva categoría, se agrega con todas las preguntas sin completar
              return {
                id: updatedCat.id,
                name: updatedCat.name,
                completed: false,
                questions: updatedCat.questions.map((q) => ({
                  id: q.id,
                  completed: false,
                })),
              }
            }),
          })),
        resetGame: () =>
          set({
            categoriesState: categoriesStateInitial,
            answeredQuestions: answeredQuestionsInitial,
            score: 0,
          }),
      }
    },
    {
      name: 'game-storage-trivia-v3',
      version: 3,
    }
  )
)

