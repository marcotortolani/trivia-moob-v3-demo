import { useReducer, useEffect } from 'react'

// Definir constantes
const MAX_RECENT_ANSWERS = 5
const MOTIVATION_TRIGGER_COUNT = 5
const TIME_TO_WAIT = 2000 // miliseconds
const TIME_SHOWING_MESSAGE = TIME_TO_WAIT + 3000 // miliseconds

// Tipos de respuestas
type AnswerType = 'correct' | 'incorrect'

// Definir tipos para el estado
type GameState = 'PLAYING' | 'CAT-FINISHED' | 'CHANGE-CAT' | 'MESSAGE'

interface GameStateType {
  currentState: GameState
  message: string
  questionsAnswered: number
  selectedAnswer: number | null
  timeUp: boolean
  dontAskAgain: boolean
  recentAnswers: AnswerType[]
}

// Tipos de acciones
type GameAction =
  | { type: 'SET_STATE'; payload: GameState }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'INCREMENT_QUESTIONS_ANSWERED' }
  | { type: 'RESET_QUESTIONS_ANSWERED' }
  | { type: 'SET_SELECTED_ANSWER'; payload: number | null }
  | { type: 'SET_TIME_UP'; payload: boolean }
  | { type: 'TOGGLE_DONT_ASK_AGAIN' }
  | { type: 'ADD_RECENT_ANSWER'; payload: AnswerType }
  | { type: 'RESET_RECENT_ANSWERS' }

// Reducer para manejar los estados del juego
function gameStateReducer(
  state: GameStateType,
  action: GameAction
): GameStateType {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload }
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    case 'INCREMENT_QUESTIONS_ANSWERED':
      return { ...state, questionsAnswered: state.questionsAnswered + 1 }
    case 'RESET_QUESTIONS_ANSWERED':
      return { ...state, questionsAnswered: 0 }
    case 'SET_SELECTED_ANSWER':
      return { ...state, selectedAnswer: action.payload }
    case 'SET_TIME_UP':
      return { ...state, timeUp: action.payload }
    case 'TOGGLE_DONT_ASK_AGAIN':
      return { ...state, dontAskAgain: !state.dontAskAgain }
    case 'ADD_RECENT_ANSWER':
      // Mantener solo los últimos 5 elementos (FIFO)
      const updatedAnswers = [
        ...state.recentAnswers.slice(-(MAX_RECENT_ANSWERS - 1)),
        action.payload,
      ]
      return {
        ...state,
        recentAnswers: updatedAnswers,
      }
    case 'RESET_RECENT_ANSWERS':
      return { ...state, recentAnswers: [] }
    default:
      return state
  }
}

// Hook personalizado para manejar el estado del juego
export function useGameStateManager(initialConfig: {
  amountAnswersToChangeCategory: number
}) {
  const [gameState, dispatch] = useReducer(gameStateReducer, {
    currentState: 'PLAYING',
    message: '',
    questionsAnswered: 0,
    selectedAnswer: null,
    timeUp: false,
    dontAskAgain: false,
    recentAnswers: [],
  })

  // Efecto para manejar los mensajes motivacionales
  useEffect(() => {
    // Solo checkear cuando tengamos 5 respuestas
    if (gameState.recentAnswers.length === MAX_RECENT_ANSWERS) {
      const getMotivationalMessage = (): {
        state: GameState
        message: string
      } => {
        // Todas las respuestas correctas
        if (gameState.recentAnswers.every((answer) => answer === 'correct')) {
          return {
            state: 'MESSAGE',
            message: '¡Muy bien, estás prendido fuego!',
          }
        }
        // Todas las respuestas incorrectas
        if (gameState.recentAnswers.every((answer) => answer === 'incorrect')) {
          return { state: 'MESSAGE', message: 'Ánimos, fue una mala racha.' }
        }
        // Al menos una respuesta correcta
        if (gameState.recentAnswers.some((answer) => answer === 'correct')) {
          return { state: 'MESSAGE', message: '¡Muy bien, sigue así!' }
        }
        // Al menos una respuesta incorrecta
        if (gameState.recentAnswers.some((answer) => answer === 'incorrect')) {
          return {
            state: 'MESSAGE',
            message: 'Viene difícil, pero no aflojes.',
          }
        }
        // Default: Ninguna de las anteriores
        return { state: 'MESSAGE', message: '¡Buen trabajo!' }
      }

      const { state, message } = getMotivationalMessage()

      const timer1 = setTimeout(() => {
        dispatch({ type: 'SET_STATE', payload: state })
        dispatch({ type: 'SET_MESSAGE', payload: message })
      }, TIME_TO_WAIT)

      const timer2 = setTimeout(() => {
        dispatch({ type: 'SET_STATE', payload: 'PLAYING' })
        dispatch({ type: 'RESET_RECENT_ANSWERS' })
      }, TIME_SHOWING_MESSAGE)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [gameState.recentAnswers])

  // Métodos para manejar transiciones de estado
  const handleQuestionAnswer = (
    isCorrect: boolean,
    onPause?: () => void,
    nextQuestion?: () => void
  ) => {
    // Agregar respuesta a las respuestas recientes
    dispatch({
      type: 'ADD_RECENT_ANSWER',
      payload: isCorrect ? 'correct' : 'incorrect',
    })

    dispatch({ type: 'INCREMENT_QUESTIONS_ANSWERED' })

    // Si está marcado "no preguntar de nuevo", omitir el cambio de categoría
    if (gameState.dontAskAgain) {
      console.log('no preguntar de nuevo y next question')

      nextQuestion?.()
      return
    }

    const isCategoryChange =
      gameState.questionsAnswered + 1 ===
      initialConfig.amountAnswersToChangeCategory

    if (isCategoryChange) {
      // Pausar el temporizador si se proporciona el método
      onPause?.()
      setTimeout(() => {
        dispatch({ type: 'SET_STATE', payload: 'CHANGE-CAT' })
        dispatch({ type: 'SET_MESSAGE', payload: '¡Cambia de categoría!' })
      }, 1000)
    } else if (gameState.currentState === 'PLAYING') {
      nextQuestion?.()
    }
  }

  const resetCategoryState = () => {
    dispatch({ type: 'RESET_QUESTIONS_ANSWERED' })
    dispatch({ type: 'SET_STATE', payload: 'PLAYING' })
    dispatch({ type: 'SET_MESSAGE', payload: '' })
  }

  return {
    gameState,
    dispatch,
    handleQuestionAnswer,
    resetCategoryState,
  }
}
