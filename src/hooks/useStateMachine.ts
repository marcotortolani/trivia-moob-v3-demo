import { useState, useCallback } from 'react'
import { useConfigStore, Lang } from '@/lib/config-store'
import MOTIVATIONAL_MESSAGES from '@/data/motivational-messages.json'
import {
  MEDAL_THRESHOLDS,
  MedalType,
} from '@/lib/questions/questions-constants'

// Configuración de transiciones con delays
const transitionDelays = [
  { from: 'answering', to: 'changeCategoryModal', delay: 2500 },
  { from: 'answering', to: 'motivationalMessage', delay: 2500 },
  { from: 'answering', to: 'goalAchieved', delay: 2500 },
  { from: 'answering', to: 'nextQuestion', delay: 2500 },
  { from: 'changeCategoryModal', to: 'motivationalMessage', delay: 5500 },
  { from: 'motivationalMessage', to: 'changeCategoryModal', delay: 2000 },
  { from: 'motivationalMessage', to: 'nextQuestion', delay: 2500 },
  { from: 'motivationalMessage', to: 'answering', delay: 2000 },
  { from: 'motivationalMessage', to: 'goalAchieved', delay: 2000 },
  { from: 'goalAchieved', to: 'nextQuestion', delay: 2000 },
]

// Tipos para definir estados y eventos
type TState =
  | 'answering'
  | 'nextQuestion'
  | 'changeCategoryModal'
  | 'motivationalMessage'
  | 'goalAchieved'

type TEvent =
  | 'ANSWER_CORRECT'
  | 'ANSWER_INCORRECT'
  | 'TIME_UP'
  | 'SHOW_NEXT_QUESTION'
  | 'NEXT_QUESTION'
  | 'DONT_ASK_AGAIN'
  | 'STAY'
  | 'SHOW_GOAL_ACHIEVED'

type ValidSizes = keyof (typeof MOTIVATIONAL_MESSAGES)[Lang][
  | 'correct'
  | 'incorrect']
export type MotivationalMessage = {
  title: string
  lottieName: string
  longMessage: string
  shortMessage: string
  type: string
  number: number
}

export type MotivationalMessageByLang = {
  [key in Lang]: MotivationalMessage
}

type PendingState = TState[]

type RecentAnswer = 'correct' | 'incorrect'
interface Context {
  recentAnswers: RecentAnswer[]
  dontAskAgain?: boolean
  motivationalMessage: MotivationalMessage
  pendingStates: PendingState
  goalAchieved?: boolean
  questionsAnswered: number
  currentMedal: MedalType
  score: number
}

// Configuración de la máquina de estados
const stateMachineConfig = {
  answering: {
    on: {
      ANSWER_CORRECT: (context: Context, payload?: { score: number }) => {
        return handleAnswerEvent(context, true, payload?.score)
      },
      ANSWER_INCORRECT: (context: Context, payload?: { score: number }) => {
        return handleAnswerEvent(context, false, payload?.score)
      },
      TIME_UP: (context: Context) => {
        context.questionsAnswered = context.questionsAnswered + 1
        const updatedAnswers: RecentAnswer[] = [
          ...context.recentAnswers.slice(-11),
          'incorrect',
        ] // Mantener las últimas 12
        context.recentAnswers = updatedAnswers
      },
    },
    onEnter: () => {},
  },
  nextQuestion: {
    on: {
      SHOW_NEXT_QUESTION: () => {
        return 'answering'
      },
    },
  },
  changeCategoryModal: {
    on: {
      STAY: (context: Context) => handleStayEvent(context),
      DONT_ASK_AGAIN: (context: Context) => {
        context.dontAskAgain = true
        return handleStayEvent(context)
      },
    },
  },
  motivationalMessage: {
    on: {
      SHOW_NEXT_QUESTION: () => 'nextQuestion',
    },
  },
  goalAchieved: {
    on: {
      SHOW_NEXT_QUESTION: () => 'nextQuestion',
    },
  },
}

// Función para manejar eventos de respuesta
function handleAnswerEvent(
  context: Context,
  isCorrect: boolean,
  score?: number
): TState | PendingState | undefined {
  const newQuestionsAnswered = context.questionsAnswered + 1
  const newAnswer = isCorrect ? 'correct' : 'incorrect'

  // Lógica de manejo de respuestas recientes
  const updatedAnswers: RecentAnswer[] = [
    ...context.recentAnswers.slice(-11),
    newAnswer,
  ] // Mantener las últimas 12

  context.questionsAnswered = newQuestionsAnswered
  context.recentAnswers = updatedAnswers

  // Lógica para modal de cambio de categoría
  if (newQuestionsAnswered % 3 === 0 && !context.dontAskAgain) {
    context?.pendingStates?.push('changeCategoryModal')
  }

  // Lógica para mensajes motivacionales
  if (updatedAnswers.length >= 3) {
    checkMotivationalMessage(context, updatedAnswers)
  }

  // Verificar logro de medalla si se recibe score
  if (score !== undefined) {
    const newMedalAchieved = checkMedalAchievement(score)

    if (
      newMedalAchieved !== null &&
      newMedalAchieved !== context.currentMedal
    ) {
      context.currentMedal = newMedalAchieved
      context.pendingStates?.push('goalAchieved')
    }
  }

  return context?.pendingStates?.length > 0
    ? context?.pendingStates?.shift()
    : 'nextQuestion'
}

// Función para manejar evento STAY
function handleStayEvent(context: Context) {
  return context?.pendingStates?.length > 0
    ? context?.pendingStates?.shift()
    : 'nextQuestion'
}

// Función para verificar mensajes motivacionales
function checkMotivationalMessage(
  context: Context,
  updatedAnswers: RecentAnswer[]
) {
  const relevantSizes = [12, 10, 7, 5, 3]

  for (const size of relevantSizes) {
    if (updatedAnswers.length >= size) {
      const recentSlice = updatedAnswers.slice(-size)

      if (recentSlice.every((answer) => answer === 'correct')) {
        context.motivationalMessage = getMotivationalMessage('correct', size)
        context?.pendingStates?.push('motivationalMessage')
        break
      }

      if (recentSlice.every((answer) => answer === 'incorrect')) {
        context.motivationalMessage = getMotivationalMessage('incorrect', size)
        context?.pendingStates?.push('motivationalMessage')
        break
      }
    }
  }
}

// Función auxiliar para obtener mensaje motivacional
function getMotivationalMessage(type: string, size: number) {
  const { lang } = useConfigStore.getState()

  return MOTIVATIONAL_MESSAGES[lang][type as 'correct' | 'incorrect'][
    size.toString() as ValidSizes
  ]
}

export function checkMedalAchievement(score: number): MedalType {
  const { config, getCategories } = useConfigStore.getState()
  const categories = getCategories()

  const totalQuestionsGame = categories.reduce((total, category) => {
    return total + category.questions.length
  }, 0)

  if (
    score >=
    MEDAL_THRESHOLDS.gold.percentageGoal *
      totalQuestionsGame *
      config.pointsCorrect
  )
    return MEDAL_THRESHOLDS.gold.type
  if (
    score >=
    MEDAL_THRESHOLDS.silver.percentageGoal *
      totalQuestionsGame *
      config.pointsCorrect
  )
    return MEDAL_THRESHOLDS.silver.type
  if (
    score >=
    MEDAL_THRESHOLDS.copper.percentageGoal *
      totalQuestionsGame *
      config.pointsCorrect
  )
    return MEDAL_THRESHOLDS.copper.type
  return null
}

//--------- USE STATE MACHINE ---------

// Hook principal de máquina de estados
export function useStateMachine(initialState = 'answering') {
  const [state, setState] = useState(initialState)
  const [context, setContext] = useState({
    questionsAnswered: 0,
    recentAnswers: [],
    dontAskAgain: false,
    pendingStates: [],
    motivationalMessage: {
      title: '',
      lottieName: '',
      longMessage: '',
      shortMessage: '',
      type: '',
      number: 0,
    },
    goalAchieved: false,
    currentMedal: null,
    score: 0,
  })

  const send = useCallback(
    (event: TEvent, payload: Record<string, any> = {}) => {
      const currentStateConfig = stateMachineConfig[state as TState]

      if ('on' in currentStateConfig && currentStateConfig.on) {
        const transition =
          currentStateConfig.on[event as keyof typeof currentStateConfig.on]

        if (transition) {
          setContext((prevContext) => {
            const newContext = { ...prevContext, ...payload }

            // Determinar el próximo estado objetivo
            let targetState: TState | undefined =
              typeof transition === 'function'
                ? (
                    transition as (
                      context: Context,
                      payload?: Record<string, any>
                    ) => TState
                  )(newContext, payload)
                : (transition as TState)

            // Si hay estados pendientes, procesar el siguiente en la cola
            if (newContext.pendingStates?.length > 0) {
              const shiftedState = newContext.pendingStates.shift()
              if (shiftedState !== undefined) {
                targetState = shiftedState
              }
            }

            const transitionConfig = transitionDelays.find(
              (t) => t.from === state && t.to === targetState
            )

            if (transitionConfig?.delay) {
              setTimeout(() => {
                setState(targetState as TState)
                // Procesar el siguiente estado pendiente automáticamente
                processPendingStates()
              }, transitionConfig.delay)
            } else if (targetState) {
              setState(targetState)
              // Procesar el siguiente estado pendiente automáticamente
              processPendingStates()
            }

            return newContext
          })
        }
      }
    },
    [state, stateMachineConfig, transitionDelays]
  )

  const processPendingStates = useCallback(() => {
    setContext((prevContext) => {
      const newContext = { ...prevContext }

      if (newContext.pendingStates?.length > 0) {
        const processNextState = (remainingStates: TState[]) => {
          if (remainingStates.length === 0) {
            // Si no hay más estados, volver a 'nextQuestion'
            setState('nextQuestion')
            return
          }

          const nextState = remainingStates[0]
          const remainingQueue = remainingStates.slice(1)

          // Buscar la configuración de transición para este estado
          const transitionConfig = transitionDelays.find(
            (t) => t.from === state && t.to === nextState
          )

          // Función para procesar el siguiente estado
          const handleNextState = () => {
            setState(nextState)

            // Si hay más estados en la cola, procesarlos
            if (remainingQueue.length > 0) {
              const nextTransitionConfig = transitionDelays.find(
                (t) => t.from === nextState && t.to === remainingQueue[0]
              )

              if (nextTransitionConfig?.delay) {
                setTimeout(() => {
                  processNextState(remainingQueue)
                }, nextTransitionConfig.delay)
              } else {
                // Si no hay delay, procesar inmediatamente
                processNextState(remainingQueue)
              }
            } else {
              // Si no hay más estados, ir a 'nextQuestion'
              setTimeout(() => {
                setState('nextQuestion')
              }, 2000) // Un pequeño delay antes de ir a nextQuestion
            }
          }

          // Aplicar delay si existe
          if (transitionConfig?.delay) {
            setTimeout(handleNextState, transitionConfig.delay)
          } else {
            handleNextState()
          }
        }

        // Comenzar a procesar los estados pendientes
        processNextState(newContext.pendingStates)

        // Limpiar los estados pendientes ya que los estamos procesando
        newContext.pendingStates = []
      }

      return newContext
    })
  }, [state, transitionDelays])

  return { state, context, send }
}
