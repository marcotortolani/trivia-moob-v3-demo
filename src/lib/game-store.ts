import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Question } from '@/types/game-types'

import configData from '@/data/config.json'
const { categories } = configData

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
  totalQuestions: number
  answeredQuestions: AnsweredQuestions
  questions: Question[]
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
  incrementScore: (points: number) => void
  updateAnsweredQuestions: (answerType: AnswerType) => void
  syncCategoriesState: (updatedCategories: typeof categories) => void
  resetGame: () => void
}

const answeredQuestionsInitial = {
  correct: 0,
  incorrect: 0,
  bonus: 0,
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      categoriesState:
        JSON.parse(localStorage.getItem('game-storage') || '{}')?.state
          ?.categoriesState || categoriesStateInitial,
      selectedCategory: JSON.parse(localStorage.getItem('game-storage') || '{}')
        ?.state?.selectedCategory || {
        id: 0,
        name: '',
        bonus: false,
        image: '',
      },
      score:
        JSON.parse(localStorage.getItem('game-storage') || '{}')?.state
          ?.score || 0,
      totalQuestions: categories.reduce(
        (acc, category) => acc + category.questions.length,
        0
      ),
      answeredQuestions:
        JSON.parse(localStorage.getItem('game-storage') || '{}')?.state
          ?.answeredQuestionsInitial || answeredQuestionsInitial,
      questions: [],
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
      setQuestions: (questions) => set({ questions }),
      incrementScore: (points) =>
        set((state) => ({ score: state.score + points })),
      // setCurrentQuestionIndex: ({ categoryID, questionIndex }) =>
      //   set((state) => ({
      //     currentQuestionIndex: {
      //       ...state.currentQuestionIndex,
      //       [categoryID]: questionIndex,
      //     },
      //   })),
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
              state.answeredQuestions.bonus + (answerType === 'bonus' ? 1 : 0),
          },
        })),
      syncCategoriesState: (updatedCategories: typeof categories) =>
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
                    existingQuestion || { id: newQuestion.id, completed: false }
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
    }),
    {
      name: 'game-storage',
      version: 3,
    }
  )
)
