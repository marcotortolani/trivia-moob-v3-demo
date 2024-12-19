import { useState, useCallback } from 'react'
import { useConfigStore } from '@/lib/config-store'
import MOTIVATIONAL_MESSAGES from '@/data/encouraging-messages.json'
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

type ValidSizes = keyof (typeof MOTIVATIONAL_MESSAGES)['correct' | 'incorrect']
export type MotivationalMessage = {
  title: string
  image: string
  longMessage: string
  shortMessage: string
}

type PendingState = TState[]

type RecentAnswer = 'correct' | 'incorrect'
interface Context {
  recentAnswers: RecentAnswer[]
  dontAskAgain?: boolean
  motivationalMessage: MotivationalMessage | null
  pendingStates: PendingState
  goalAchieved?: boolean
  questionsAnswered: number
  currentMedal: MedalType
  score: number
}

//type Transition = TState | ((context: Context) => TState)

// type StateMachineConfig<TState extends string, TEvent extends string> = {
//   [key in TState]: {
//     on?: {
//       [key in TEvent]?:
//         | TState
//         | ((context: Context, event?: TEvent, action?: () => void) => TState)
//     }
//     onEnter?: (context: Context) => void
//     onExit?: (context: Context) => void
//     after?: {
//       delay: number // Tiempo en milisegundos
//       target: TState // Estado al que debe transicionar automáticamente
//     }
//   }
// }

// type StateConfig = {
//   [key in TState]?: {
//     on?: {
//       [key in TEvent]?: TState | ((context: Context) => TState)
//     }
//     onEnter?: (context: Context) => void
//     onExit?: (context: Context) => void
//   }
// }

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
  return MOTIVATIONAL_MESSAGES[type as 'correct' | 'incorrect'][
    size.toString() as ValidSizes
  ]
}

export function checkMedalAchievement(score: number): MedalType {
  const { config, categories } = useConfigStore.getState()

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
      image: '',
      longMessage: '',
      shortMessage: '',
    },
    goalAchieved: false,
    currentMedal: null,
    score: 0,
  })

  // const send = useCallback(
  //   (event: TEvent, payload: Record<string, any> = {}) => {
  //     const currentStateConfig = stateMachineConfig[state as TState]

  //     if ('on' in currentStateConfig && currentStateConfig.on) {
  //       const transition =
  //         currentStateConfig.on[event as keyof typeof currentStateConfig.on]

  //       if (transition) {
  //         setContext((prevContext) => {
  //           const newContext = { ...prevContext, ...payload }

  //           let targetState: TState | undefined =
  //             typeof transition === 'function'
  //               ? (
  //                   transition as (
  //                     context: Context,
  //                     payload?: Record<string, any>
  //                   ) => TState
  //                 )(newContext, payload)
  //               : (transition as TState)

  //           if (newContext.pendingStates?.length > 0) {
  //             const shiftedState = newContext.pendingStates.shift()
  //             if (shiftedState !== undefined) {
  //               targetState = shiftedState
  //             } else {
  //               // Maneja el caso de que shiftedState sea undefined si es necesario
  //             }
  //           }

  //           const transitionConfig = transitionDelays.find(
  //             (t) => t.from === state && t.to === targetState
  //           )

  //           if (transitionConfig?.delay) {
  //             setTimeout(
  //               () => setState(targetState as TState),
  //               transitionConfig.delay
  //             )
  //           } else if (targetState) {
  //             setState(targetState)
  //           }

  //           return newContext
  //         })
  //       }
  //     }
  //   },
  //   [state, stateMachineConfig, transitionDelays]
  // )

  // const send = useCallback(
  //   (event: TEvent, payload: Record<string, any> = {}) => {
  //     const currentStateConfig = stateMachineConfig[state as TState]

  //     if ('on' in currentStateConfig && currentStateConfig.on) {
  //       const transition =
  //         currentStateConfig.on[event as keyof typeof currentStateConfig.on]

  //       if (transition) {
  //         setContext((prevContext) => {
  //           const newContext = { ...prevContext, ...payload }

  //           let targetState: TState | undefined =
  //             typeof transition === 'function'
  //               ? (
  //                   transition as (
  //                     context: Context,
  //                     payload?: Record<string, any>
  //                   ) => TState
  //                 )(newContext, payload)
  //               : (transition as TState)

  //           // Prioritize pending states while maintaining their order
  //           if (newContext.pendingStates?.length > 0) {
  //             targetState = newContext.pendingStates[0]
  //           }

  //           const transitionConfig = transitionDelays.find(
  //             (t) => t.from === state && t.to === targetState
  //           )

  //           if (transitionConfig?.delay) {
  //             setTimeout(() => {
  //               setState(targetState as TState)

  //               // Remove the first pending state after transition
  //               if (newContext.pendingStates?.length > 0) {
  //                 newContext.pendingStates.shift()
  //               }
  //             }, transitionConfig.delay)
  //           } else if (targetState) {
  //             setState(targetState)

  //             // Remove the first pending state if there are any
  //             if (newContext.pendingStates?.length > 0) {
  //               newContext.pendingStates.shift()
  //             }
  //           }

  //           return newContext
  //         })
  //       }
  //     }
  //   },
  //   [state, stateMachineConfig, transitionDelays]
  // )
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

// import { useState, useCallback } from 'react'
// import MOTIVATIONAL_MESSAGES from '@/data/encouraging-messages.json'

// // Tipos para definir estados y eventos
// type TState =
//   | 'answering'
//   | 'nextQuestion'
//   | 'changeCategoryModal'
//   | 'motivationalMessage'
//   | 'goalAchieved'

// type TEvent =
//   | 'ANSWER_CORRECT'
//   | 'ANSWER_INCORRECT'
//   | 'SHOW_NEXT_QUESTION'
//   | 'NEXT_QUESTION'
//   | 'DONT_ASK_AGAIN'
//   | 'STAY'
//   | 'SHOW_GOAL_ACHIEVED'

// type ValidSizes = keyof (typeof MOTIVATIONAL_MESSAGES)['correct' | 'incorrect']
// export type MotivationalMessage = {
//   title: string
//   image: string
//   longMessage: string
//   shortMessage: string
// }

// type PendingState = TState[]

// type RecentAnswer = 'correct' | 'incorrect'
// interface Context {
//   recentAnswers: RecentAnswer[]
//   dontAskAgain?: boolean
//   motivationalMessage: MotivationalMessage | null
//   pendingStates: PendingState
//   goalAchieved?: boolean
//   questionsAnswered: number
// }

// //type Transition = TState | ((context: Context) => TState)

// // type StateMachineConfig<TState extends string, TEvent extends string> = {
// //   [key in TState]: {
// //     on?: {
// //       [key in TEvent]?:
// //         | TState
// //         | ((context: Context, event?: TEvent, action?: () => void) => TState)
// //     }
// //     onEnter?: (context: Context) => void
// //     onExit?: (context: Context) => void
// //     after?: {
// //       delay: number // Tiempo en milisegundos
// //       target: TState // Estado al que debe transicionar automáticamente
// //     }
// //   }
// // }

// // type StateConfig = {
// //   [key in TState]?: {
// //     on?: {
// //       [key in TEvent]?: TState | ((context: Context) => TState)
// //     }
// //     onEnter?: (context: Context) => void
// //     onExit?: (context: Context) => void
// //   }
// // }

// // Configuración de transiciones con delays
// const transitionDelays = [
//   { from: 'answering', to: 'changeCategoryModal', delay: 2500 },
//   { from: 'answering', to: 'motivationalMessage', delay: 2000 },
//   { from: 'changeCategoryModal', to: 'motivationalMessage', delay: 1500 },
//   { from: 'motivationalMessage', to: 'nextQuestion', delay: 2500 },
//   { from: 'motivationalMessage', to: 'answering', delay: 500 },
//   { from: 'goalAchieved', to: 'nextQuestion', delay: 500 },
// ]

// // Configuración de la máquina de estados
// const stateMachineConfig = {
//   answering: {
//     on: {
//       ANSWER_CORRECT: (context: Context) => {
//         return handleAnswerEvent(context, true)
//       },
//       ANSWER_INCORRECT: (context: Context) => {
//         return handleAnswerEvent(context, false)
//       },
//     },
//     onEnter: (context: Context) => {
//       console.log(`Preguntas respondidas: ${context.questionsAnswered}`)
//     },
//   },
//   nextQuestion: {
//     on: {
//       SHOW_NEXT_QUESTION: (context: Context, _: TEvent, action: () => void) => {
//         if (action) action()
//         return 'answering'
//       },
//     },
//   },
//   changeCategoryModal: {
//     on: {
//       STAY: (context: Context) => handleStayEvent(context),
//       DONT_ASK_AGAIN: (context: Context) => {
//         context.dontAskAgain = true
//         return handleStayEvent(context)
//       },
//     },
//   },
//   motivationalMessage: {
//     on: {
//       SHOW_NEXT_QUESTION: (context: Context, _: TEvent, action: () => void) => {
//         if (action) action()
//         return 'nextQuestion'
//       },
//     },
//   },
//   goalAchieved: {
//     on: {},
//   },
// }

// // Función para manejar eventos de respuesta
// function handleAnswerEvent(
//   context: Context,
//   isCorrect: boolean
// ): TState | PendingState | undefined {
//   const newQuestionsAnswered = context.questionsAnswered + 1
//   const newAnswer = isCorrect ? 'correct' : 'incorrect'

//   // Lógica de manejo de respuestas recientes
//   const updatedAnswers: RecentAnswer[] = [
//     ...context.recentAnswers.slice(-11),
//     newAnswer,
//   ] // Mantener las últimas 12

//   context.questionsAnswered = newQuestionsAnswered
//   context.recentAnswers = updatedAnswers

//   // Lógica para modal de cambio de categoría
//   if (newQuestionsAnswered % 3 === 0 && !context.dontAskAgain) {
//     context?.pendingStates?.push('changeCategoryModal')
//   }

//   // Lógica para mensajes motivacionales
//   if (updatedAnswers.length >= 3) {
//     checkMotivationalMessage(context, updatedAnswers)
//   }

//   console.log('-- --- ---> pending states: ', context?.pendingStates)

//   return context?.pendingStates?.length > 0
//     ? context?.pendingStates?.shift()
//     : 'nextQuestion'
// }

// // Función para manejar evento STAY
// function handleStayEvent(context: Context) {
//   return context?.pendingStates?.length > 0
//     ? context?.pendingStates?.shift()
//     : 'nextQuestion'
// }

// // Función para verificar mensajes motivacionales
// function checkMotivationalMessage(
//   context: Context,
//   updatedAnswers: RecentAnswer[]
// ) {
//   const relevantSizes = [12, 10, 7, 5, 3]

//   for (const size of relevantSizes) {
//     if (updatedAnswers.length >= size) {
//       const recentSlice = updatedAnswers.slice(-size)

//       if (recentSlice.every((answer) => answer === 'correct')) {
//         context.motivationalMessage = getMotivationalMessage('correct', size)
//         context?.pendingStates?.push('motivationalMessage')
//         break
//       }

//       if (recentSlice.every((answer) => answer === 'incorrect')) {
//         context.motivationalMessage = getMotivationalMessage('incorrect', size)
//         context?.pendingStates?.push('motivationalMessage')
//         break
//       }
//     }
//   }
// }

// // Función auxiliar para obtener mensaje motivacional
// function getMotivationalMessage(type: string, size: number) {
//   return MOTIVATIONAL_MESSAGES[type as 'correct' | 'incorrect'][
//     size.toString() as ValidSizes
//   ]
// }

// // Hook principal de máquina de estados
// export function useStateMachine(initialState = 'answering') {
//   const [state, setState] = useState(initialState)
//   const [context, setContext] = useState({
//     questionsAnswered: 0,
//     recentAnswers: [],
//     dontAskAgain: false,
//     pendingStates: [],
//     motivationalMessage: {
//       title: '',
//       image: '',
//       longMessage: '',
//       shortMessage: '',
//     },
//     goalAchieved: false,
//   })

//   const send = useCallback(
//     (event: TEvent, payload = {}) => {
//       const currentStateConfig = stateMachineConfig[state as TState]

//       if ('on' in currentStateConfig && currentStateConfig.on) {
//         const transition =
//           currentStateConfig.on[event as keyof typeof currentStateConfig.on]

//         if (transition) {
//           setContext((prevContext) => {
//             const newContext = { ...prevContext, ...payload }

//             let targetState: TState | undefined =
//               typeof transition === 'function'
//                 ? (transition as (context: Context) => TState)(newContext)
//                 : (transition as TState)

//             if (newContext.pendingStates?.length > 0) {
//               const shiftedState = newContext.pendingStates.shift()
//               if (shiftedState !== undefined) {
//                 targetState = shiftedState
//               } else {
//                 // Maneja el caso de que shiftedState sea undefined si es necesario
//               }
//             }

//             const transitionConfig = transitionDelays.find(
//               (t) => t.from === state && t.to === targetState
//             )

//             if (transitionConfig?.delay) {
//               setTimeout(
//                 () => setState(targetState as TState),
//                 transitionConfig.delay
//               )
//             } else if (targetState) {
//               setState(targetState)
//             }

//             return newContext
//           })
//         }
//       }
//     },
//     [state, stateMachineConfig, transitionDelays]
//   )

//   return { state, context, send }
// }

// 'use client'
// import { useState, useCallback, useEffect, useRef } from 'react'
// import MOTIVATIONAL_MESSAGES from '@/data/encouraging-messages.json'

// const AMOUNT_RECENT_ANSWERS = 12
// const AMOUNT_ANSWERS_CHANGE_CATEGORY = 3
// const MOTIVATIONAL_MESSAGES_TIMEOUT = 2000
// const GOAL_ACHIEVED_TIMEOUT = 2000

// type ValidSizes = keyof (typeof MOTIVATIONAL_MESSAGES)['correct' | 'incorrect']
// export type MotivationalMessage = (typeof MOTIVATIONAL_MESSAGES)[
//   | 'correct'
//   | 'incorrect'][ValidSizes]

// export type TState =
//   | 'answering'
//   | 'nextQuestion'
//   | 'changeCategoryModal'
//   | 'motivationalMessage'
//   | 'goalAchieved'

// type PendingState = TState[]
// export type TEvent =
//   | 'ANSWER_CORRECT'
//   | 'ANSWER_INCORRECT'
//   | 'SHOW_NEXT_QUESTION'
//   | 'DONT_ASK_AGAIN'
//   | 'STAY'

// type StateMachineConfig<TState extends string, TEvent extends string> = {
//   [key in TState]: {
//     on?: {
//       [key in TEvent]?:
//         | TState
//         | ((context: Context, event?: TEvent, action?: () => void) => TState)
//     }
//     onEnter?: (context: Context) => void
//     onExit?: (context: Context) => void
//     after?: {
//       delay: number // Tiempo en milisegundos
//       target: TState // Estado al que debe transicionar automáticamente
//     }
//   }
// }

// interface StateMachineHook<TState extends string, TEvent extends string> {
//   state: TState
//   context: Context
//   send: (event: TEvent, payload?: any) => void
// }

// type RecentAnswer = 'correct' | 'incorrect'
// interface Context {
//   amountQuestionsAnswered: number
//   recentAnswers: RecentAnswer[]
//   dontAskAgain?: boolean
//   motivationalMessage?: MotivationalMessage
//   pendingStates?: PendingState
// }

// const stateMachineConfig: StateMachineConfig<TState, TEvent> = {
//   answering: {
//     on: {
//       ANSWER_CORRECT: (context: Context) => handleAnswerEvent(context, true),
//       ANSWER_INCORRECT: (context: Context) => handleAnswerEvent(context, false),
//     },
//     onEnter: (context: Context) => {
//       console.log(
//         `Preguntas respondidas: ${context.amountQuestionsAnswered}, Respuestas recientes: ${context.recentAnswers}`
//       )
//     },
//   },
//   nextQuestion: {
//     onEnter: () => {
//       console.log('Siguiente pregunta.')
//     },
//     on: {
//       SHOW_NEXT_QUESTION: (context, event, action) => {
//         if (action) action()
//         return 'answering'
//       },
//     },
//   },
//   changeCategoryModal: {
//     onEnter: () => {
//       console.log('Mostrando el modal de cambio de categoría')
//     },
//     on: {
//       STAY: (context: Context) => {
//         if (
//           context &&
//           context.pendingStates &&
//           context.pendingStates.length > 0
//         ) {
//           return context.pendingStates.shift()! // Toma el próximo estado
//         }
//         return 'nextQuestion' // Si no hay más pendientes, regresa a "nextQuestion"
//       },
//       DONT_ASK_AGAIN: (context: Context) => {
//         context.dontAskAgain = true
//         if (
//           context &&
//           context.pendingStates &&
//           context.pendingStates.length > 0
//         ) {
//           return context.pendingStates.shift()! // Toma el próximo estado
//         }
//         return 'nextQuestion'
//       },
//     },
//   },
//   motivationalMessage: {
//     onEnter: () => {
//       console.log('Mostrando mensaje motivacional.')
//     },
//     after: {
//       delay: MOTIVATIONAL_MESSAGES_TIMEOUT, // Retraso de salida
//       target: 'nextQuestion', // Transición al estado "nextQuestion" después del retraso
//     },
//   },
//   goalAchieved: {
//     onEnter: () => {
//       console.log('Se ha alcanzado el objetivo.')
//     },
//     after: {
//       delay: GOAL_ACHIEVED_TIMEOUT, // Retraso de salida
//       target: 'nextQuestion', // Transición al estado "nextQuestion" después del retraso
//     },
//   },
// }
// // Función para manejar el evento ANSWER
// function handleAnswerEvent(context: any, isCorrect?: boolean): TState {
//   // Asegurar que pendingStates exista
//   if (context.pendingStates && context.pendingStates.length > 0) {
//     return context.pendingStates[0] // Devuelve el primer estado pendiente
//   }
//   const newQuestionsAnswered = context.amountQuestionsAnswered + 1

//   // Determinar si la respuesta fue correcta o incorrecta
//   const newAnswer = isCorrect ? 'correct' : 'incorrect'

//   // Actualizar recentAnswers con un máximo de 12 respuestas
//   const updatedAnswers = [
//     ...context.recentAnswers.slice(-AMOUNT_RECENT_ANSWERS - 1), // Mantener las últimas 11
//     newAnswer, // Agregar la nueva respuesta
//   ]

//   // Actualizar el contexto con los nuevos valores
//   context.amountQuestionsAnswered = newQuestionsAnswered
//   context.recentAnswers = updatedAnswers

//   // Verificar si se debe mostrar el modal de cambio de categoría
//   if (
//     newQuestionsAnswered % AMOUNT_ANSWERS_CHANGE_CATEGORY === 0 &&
//     !context.dontAskAgain
//   ) {
//     context.pendingStates.push('changeCategoryModal')
//   }

//   // Verificar si las respuestas recientes cumplen con las condiciones para mostrar mensaje motivacional
//   if (updatedAnswers.length >= 3) {
//     const relevantSizes = [12, 10, 7, 5, 3]
//     for (const size of relevantSizes) {
//       if (updatedAnswers.length >= size) {
//         const recentSlice = updatedAnswers.slice(-size)

//         // Si todas las respuestas son "correct"
//         if (recentSlice.every((answer: string) => answer === 'correct')) {
//           context.motivationalMessage =
//             MOTIVATIONAL_MESSAGES.correct[size.toString() as ValidSizes]
//           context.pendingStates.push('motivationalMessage')
//           break // Salir del loop, ya que ya se determinó un mensaje motivacional
//         }

//         // Si todas las respuestas son "incorrect"
//         if (recentSlice.every((answer: string) => answer === 'incorrect')) {
//           context.motivationalMessage =
//             MOTIVATIONAL_MESSAGES.incorrect[size.toString() as ValidSizes]
//           context.pendingStates.push('motivationalMessage')
//           break // Salir del loop, ya que ya se determinó un mensaje motivacional
//         }
//       }
//     }
//   }
//   // Si no hay pendientes, permanece el estado actual
//   return 'nextQuestion'
// }

// const initialContext: Context = {
//   amountQuestionsAnswered: 0,
//   recentAnswers: [],
//   dontAskAgain: false,
//   pendingStates: [],
// }

// export const useStateMachine = <TState extends string, TEvent extends string>(
//   initialState: TState,
//   stateConfig = stateMachineConfig as {
//     [key in TState]: {
//       on?: {
//         [key in TEvent]?:
//           | TState
//           | ((context: Context, event?: TEvent, action?: () => void) => TState)
//       }
//       onEnter?: (context: Context) => void
//       onExit?: (context: Context) => void
//       after?: {
//         delay: number
//         target: TState
//       }
//     }
//   }
// ): StateMachineHook<TState, TEvent> => {
//   // Configuración de transiciones con delays
//   const transitionDelays: TransitionConfig[] = [
//     {
//       from: 'answering',
//       to: 'motivationalMessage',
//       delay: 500,
//     },
//     {
//       from: 'answering',
//       to: 'changeCategoryModal',
//       delay: 500,
//     },
//     {
//       from: 'changeCategoryModal',
//       to: 'motivationalMessage',
//       delay: 500,
//     },
//     {
//       from: 'motivationalMessage',
//       to: 'nextQuestion',
//       delay: 500,
//     },
//     {
//       from: 'motivationalMessage',
//       to: 'answering',
//       delay: 500,
//     },
//   ]

//   // Usar el nuevo middleware de transiciones
//   const transitionMiddleware = useAdvancedStateMachine(initialState, {
//     transitions: transitionDelays,
//     stateConfig: stateConfig as StateMachineOptions['stateConfig'],
//   })
//   const [state, setState] = useState<TState>(initialState)
//   const [context, setContext] = useState(initialContext)

//   const send = useCallback(
//     (event: TEvent, payload?: any) => {
//       const currentStateConfig = stateConfig[state]
//       const transition = currentStateConfig.on?.[event]

//       if (transition) {
//         let targetState: TState

//         // Determine target state
//         if (typeof transition === 'function') {
//           targetState = transition(context, event)
//         } else {
//           targetState = transition as TState
//         }

//         // If there are pending states, process them first
//         if (context.pendingStates && context.pendingStates.length > 0) {
//           targetState = context.pendingStates.shift()! as TState
//         }

//         // Use middleware to handle transition
//         transitionMiddleware.transition(targetState as string)

//         // Update context
//         if (payload) {
//           setContext((prev) => ({ ...prev, ...payload }))
//         }
//       }
//     },
//     [state, context, stateConfig, transitionMiddleware]
//   )

//   // Sincronizar el estado de la máquina de estado con el middleware
//   useEffect(() => {
//     setState(transitionMiddleware.state as TState)
//   }, [transitionMiddleware.state])

//   // Limpiar recursos al desmontar
//   useEffect(() => {
//     return () => {
//       transitionMiddleware.cleanup()
//     }
//   }, [transitionMiddleware])

//   return {
//     state,
//     context,
//     send,
//     // Opcionalmente exponer métodos del middleware si se necesitan
//     //transitionMiddleware,
//   }
// }

// export interface TransitionConfig {
//   from: string
//   to: string
//   delay?: number
// }

// export interface StateMachineOptions {
//   transitions?: TransitionConfig[]
//   stateConfig?: {
//     [key: string]: {
//       on?: {
//         [key: string]: string
//       }
//       onEnter?: () => void
//       onExit?: () => void
//       after?: {
//         delay: number
//         target: TState
//       }
//     }
//   }
// }

// function useAdvancedStateMachine(
//   initialState: string,
//   options: StateMachineOptions = {}
// ) {
//   const [state, setState] = useState(initialState)
//   const transitionQueueRef = useRef<(() => void)[]>([])
//   const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const processTransitionQueue = useCallback(() => {
//     if (transitionQueueRef.current.length > 0) {
//       const nextTransition = transitionQueueRef.current.shift()
//       if (nextTransition) {
//         nextTransition()
//       }
//     }
//   }, [])

//   const transition = useCallback(
//     (newState: string) => {
//       // Clear any existing timeout
//       if (currentTimeoutRef.current) {
//         clearTimeout(currentTimeoutRef.current)
//       }

//       // Find transition config
//       const transitionConfig = options.transitions?.find(
//         (t) => t.from === state && t.to === newState
//       )

//       const performTransition = () => {
//         console.log('transitioning to: ', newState)

//         // Set the new state
//         setState(newState)

//         // Process any queued transitions
//         processTransitionQueue()

//         // Check for automatic 'after' transition
//         const stateConfig = options.stateConfig?.[newState]
//         if (stateConfig?.after) {
//           const { delay, target } = stateConfig.after
//           console.log(`Scheduling after transition to ${target} in ${delay}ms`)

//           // Use a new timeout to handle the 'after' transition
//           currentTimeoutRef.current = setTimeout(() => {
//             console.log(`Performing after transition to ${target}`)
//             // Recursively transition to the target state
//             transition(target)
//           }, delay)
//         }
//       }

//       // If there's a configured delay, use setTimeout
//       if (transitionConfig?.delay) {
//         currentTimeoutRef.current = setTimeout(
//           performTransition,
//           transitionConfig.delay
//         )
//       } else {
//         // Immediate transition
//         performTransition()
//       }
//     },
//     [state, options.transitions, options.stateConfig, processTransitionQueue]
//   )

//   const queueTransition = useCallback(
//     (newState: string) => {
//       transitionQueueRef.current.push(() => transition(newState))
//     },
//     [transition]
//   )

//   const cleanup = useCallback(() => {
//     if (currentTimeoutRef.current) {
//       clearTimeout(currentTimeoutRef.current)
//     }
//   }, [])

//   return {
//     state,
//     transition,
//     queueTransition,
//     cleanup,
//   }
// }
