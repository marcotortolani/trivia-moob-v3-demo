// 'use client'

// import { useEffect, useState, useMemo, useCallback } from 'react'

// import { CardQuestion } from './card-question'
// import { useGameStore } from '@/lib/game-store'
// import { useConfigStore } from '@/lib/config-store'
// import { useQuestionStore } from '@/lib/questions/questions-store'

// import { useScoreManager } from '@/app/hooks/useScoreManager'
// import { useCountdown } from '@/app/hooks/useCountDown'
// import { useQuestionsAnswered } from '@/app/hooks/useQuestionsAnswered'
// import { AnimatePresence } from 'framer-motion'

// import ModalChangeCategory from './modal-change-category'
// import ModalEncouragingMessage from './modal-encouraging-message'

// import ENCOURAGING_MESSAGES from '@/data/encouraging-messages.json'
// type ValidSizes = keyof (typeof ENCOURAGING_MESSAGES)['correct' | 'incorrect']
// export type EncouragingMessage = (typeof ENCOURAGING_MESSAGES)[
//   | 'correct'
//   | 'incorrect'][ValidSizes]

// const maxAmountRecentAnswers = 12

// export function PlayingScreen() {
//   const {
//     selectedCategory,
//     updateAnsweredQuestions,
//     updateCategoriesState,
//     questions,
//     categoriesState,
//   } = useGameStore()
//   const { config } = useConfigStore()
//   const {
//     gameState,
//     setGameState,
//     currentQuestion,
//     setCurrentQuestion,
//     answerSelected,
//     setAnswerSelected,
//     setShowExtraPoints,
//     amountQuestionsAnswered,
//     setAmountQuestionsAnswered,
//   } = useQuestionStore()

//   const { countdownSeconds, amountAnswersToChangeCategory } = config
//   const { calculateScore, updateScore } = useScoreManager()
//   const { questionsAnswered } = useQuestionsAnswered(selectedCategory?.id)
//   const [recentAnswers, setRecentAnswers] = useState<string[]>([])
//   const [direction, setDirection] = useState(0)
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

//   const [playingState, setPlayingState] = useState<
//     'ANSWERING' | 'CHANGE_CATEGORY' | 'ENCOURAGING_MESSAGE'
//   >('ANSWERING')
//   const [encouragingMessage, setEncouragingMessage] =
//     useState<EncouragingMessage | null>(null)

//   const {
//     seconds: secondsLeft,
//     reset: timerReset,
//     pause: timerPause,
//     isActive: timerIsActive,
//   } = useCountdown(countdownSeconds, () => {})

//   const categoryHasBonus = useMemo(() => {
//     return selectedCategory?.bonus
//   }, [selectedCategory])

//   // useEffect(() => {

//   //   if (gameState?.recentAnswers?.length >= 3) {
//   //     timerPause()
//   //     handleEncouragingMessage({ recentAnswers: gameState?.recentAnswers })
//   //   }
//   // }, [gameState?.recentAnswers])

//   useEffect(() => {
//     if (!questions || categoriesState?.length === 0) return

//     const newQuestionIndex =
//       categoriesState
//         ?.find((cat) => cat.id === selectedCategory?.id)
//         ?.questions.findIndex((q) => !q.completed) ?? 0
//     setCurrentQuestionIndex(newQuestionIndex)
//     setCurrentQuestion(questions?.[newQuestionIndex])
//   }, [])

//   const handleEncouragingMessage = useCallback((recentAnswers: string[]) => {
//     //const recentAnswers = gameState?.recentAnswers
// if (recentAnswers?.length < 3) return false

// console.log('Recent answers: ', recentAnswers)

// // Define los tamaños relevantes en orden descendente
// const relevantSizes = [12, 10, 7, 5, 3]

// for (const size of relevantSizes) {
//   // Verificamos si el array tiene al menos `size` elementos
//   if (recentAnswers.length >= size) {
//     const recentSlice = recentAnswers.slice(-size)

//     // Verificamos si todos son "correct"
//     if (recentSlice.every((answer) => answer === 'correct')) {
//       const key = size.toString() as ValidSizes
//       setTimeout(() => {
//         setEncouragingMessage(ENCOURAGING_MESSAGES.correct[key])
//         timerPause()
//         setPlayingState('ENCOURAGING_MESSAGE')
//       }, 2000)
//       return true
//     }

//     // Verificamos si todos son "incorrect"
//     if (recentSlice.every((answer) => answer === 'incorrect')) {
//       const key = size.toString() as ValidSizes
//       setTimeout(() => {
//         setEncouragingMessage(ENCOURAGING_MESSAGES.incorrect[key])
//         timerPause()
//         setPlayingState('ENCOURAGING_MESSAGE')
//       }, 2000)
//       return true
//     }
//   }
// }

//     return false
//   }, [])

//   const handleAnswerSelected = useCallback(
//     (answerIndex: number) => {
//       if (answerSelected !== null) return
//       setAnswerSelected(answerIndex)
//       timerPause()

//       setAmountQuestionsAnswered(amountQuestionsAnswered + 1)
//       setShowExtraPoints(true)

//       const isCorrect =
//         currentQuestion?.answers[answerIndex]?.isCorrect ?? false
//       const questionsHasBonus = currentQuestion?.bonus ?? false
//       const points = calculateScore(
//         isCorrect,
//         secondsLeft,
//         questionsHasBonus,
//         categoryHasBonus
//       )
//       updateScore(points)
//       // Actualizar estado de respuestas
//       updateAnsweredQuestions(
//         isCorrect
//           ? questionsHasBonus || categoryHasBonus
//             ? 'bonus'
//             : 'correct'
//           : 'incorrect'
//       )
//       // Agregar respuesta a las respuestas recientes
//       const recentAnswersUpdated = addRecentAnswer(
//         isCorrect ? 'correct' : 'incorrect'
//       )
//       updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
//       setDirection(-1)

//       // const askToChangeCategory =
//       //   amountQuestionsAnswered + 1 === amountAnswersToChangeCategory
//       // if (
//       //   askToChangeCategory &&
//       //   !gameState.dontAskAgain &&
//       //   playingState === 'ANSWERING'
//       // ) {
//       //   setTimeout(() => {
//       //     setPlayingState('CHANGE_CATEGORY')
//       //   }, 1000)

//       //   return
//       // }
//       const encouragingMessageState =
//         handleEncouragingMessage(recentAnswersUpdated)
//       if (!encouragingMessageState) {
//         setTimeout(() => {
//           nextQuestion()
//         }, 1000)
//       }
//     },
//     [
//       answerSelected,
//       amountQuestionsAnswered,
//       amountAnswersToChangeCategory,
//       calculateScore,
//       currentQuestion,
//       updateAnsweredQuestions,
//       updateCategoriesState,
//       selectedCategory,
//       secondsLeft,
//       categoryHasBonus,
//     ]
//   )
//   const addRecentAnswer = (newAnswer: string) => {
//     // set recent answers with 12 elements max
//     const updatedAnswers = [...recentAnswers, newAnswer]
//     const slicedAnswers = updatedAnswers.slice(
//       Math.max(0, updatedAnswers.length - maxAmountRecentAnswers)
//     )
//     setRecentAnswers(slicedAnswers)
//     return slicedAnswers
//   }

//   const nextQuestion = () => {
//     console.log('nextQuestion')

//     setAnswerSelected(null)
//     setShowExtraPoints(false)

//     if (questionsAnswered + 1 < questions?.length) {
//       console.log('set next question')
//       const newQuestionIndex = currentQuestionIndex + 1
//       setCurrentQuestionIndex(newQuestionIndex)
//       setCurrentQuestion(questions?.[newQuestionIndex])
//       timerReset()
//     }
//   }
//   function handleTimeUp() {
//     timerPause()
//     setDirection(-1)
//     updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
//     updateAnsweredQuestions('incorrect')
//     addRecentAnswer('incorrect')
//     setTimeout(() => {
//       nextQuestion()
//     }, 1000)
//   }

//   useEffect(() => {
//     if (currentQuestion?.id) {
//       timerReset()
//       setDirection(-1)
//       setShowExtraPoints(false)
//     }
//   }, [currentQuestion?.id])

//   useEffect(() => {
//     if (playingState !== 'ANSWERING') return
//     if (questionsAnswered === questions?.length) {
//       timerPause()
//       setTimeout(() => {
//         setGameState({ currentState: 'CAT_FINISHED' })
//       }, 2000)
//     }
//   }, [questionsAnswered, questions?.length])

//   useEffect(() => {
//     if (secondsLeft === 0) {
//       handleTimeUp()
//     }
//   }, [secondsLeft])

//   return (
//     <div className=" ">
//       <AnimatePresence mode="wait" custom={direction}>
//         {playingState === 'ANSWERING' && (
//           <CardQuestion
//             question={currentQuestion}
//             onAnswer={handleAnswerSelected}
//             secondsLeft={secondsLeft}
//             timerIsActive={timerIsActive}
//             direction={direction}
//           />
//         )}
//         {playingState === 'CHANGE_CATEGORY' && (
//           <ModalChangeCategory
//             onCloseModal={() => {
//               setPlayingState('ANSWERING')
//               nextQuestion()
//             }}
//           />
//         )}
//         {playingState === 'ENCOURAGING_MESSAGE' && (
//           <ModalEncouragingMessage
//             encouragingMessage={encouragingMessage}
//             onCloseMessage={() => {
//               setPlayingState('ANSWERING')
//               setEncouragingMessage(null)
//               nextQuestion()
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

'use client'

import { useEffect, useCallback, useState } from 'react'
// import { useMachine } from '@xstate/react'
import { AnimatePresence, delay, motion } from 'framer-motion'
import { CardQuestion } from './card-question'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { useScoreManager } from '@/app/hooks/useScoreManager'
import { useCountdown } from '@/app/hooks/useCountDown'
import { useQuestionsAnswered } from '@/app/hooks/useQuestionsAnswered'
import ModalChangeCategory from './modal-change-category'
import ModalEncouragingMessage from './modal-motivational-message'
import { gameMachine } from '@/lib/questions/game-machine'
import ENCOURAGING_MESSAGES from '@/data/encouraging-messages.json'
import { useRouter } from 'next/navigation'
import { useStateMachine } from '@/app/hooks/useStateMachine'

type ValidSizes = keyof (typeof ENCOURAGING_MESSAGES)['correct' | 'incorrect']
export type EncouragingMessage = (typeof ENCOURAGING_MESSAGES)[
  | 'correct'
  | 'incorrect'][ValidSizes]

export function PlayingScreen() {
  const router = useRouter()
  const { state, send, context } = useStateMachine('answering')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [score, setScore] = useState(0)

  useEffect(() => {
    if (state === 'nextQuestion' || state === 'goalAchieved') {
      handleNextQuestion()
    }
    if (state === 'answering') {
      handlePlaying()
    }
    if (state === 'motivationalMessage') {
      setTimeout(() => {
        send('SHOW_NEXT_QUESTION')
      }, 50)
    }
  }, [state])

  const handleAnswer = (isCorrect: boolean) => {
    // stopTimer()
    const scoreUpdated = score + (isCorrect ? 5000 : 100)
    setScore(scoreUpdated)
    send(isCorrect ? 'ANSWER_CORRECT' : 'ANSWER_INCORRECT', {
      score: scoreUpdated,
    })
  }

  const handleDontAskAgain = () => {
    send('DONT_ASK_AGAIN')
  }

  const handleStay = () => {
    send('STAY')
  }

  const handlePlaying = () => {
    console.log(' ---- ---- ----- --> PLAYING')
  }

  const handleNextQuestion = () => {
    handleTimerPause()
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    send('SHOW_NEXT_QUESTION')
    handleTimerOn()
  }

  const handleTimerOn = () => {
    console.log(' ---- ---- ----- --> TIMER ON')
  }

  const handleTimerPause = () => {
    console.log(' ---- ---- ----- --> TIMER PAUSE')
  }

  return (
    <div>
      <h1>Estado actual: {state}</h1>
      <p>Preguntas respondidas: {context.questionsAnswered}</p>
      <p>Puntaje: {score}</p>

      {state === 'answering' && (
        <motion.div className=" flex flex-col items-center gap-2">
          <p>Current Question Index: {currentQuestionIndex}</p>
          <button
            className=" mt-4 bg-green-500 text-white"
            onClick={() => handleAnswer(true)}
          >
            Correcta
          </button>
          <button
            className=" mt-2 bg-red-500 text-white"
            onClick={() => handleAnswer(false)}
          >
            Incorrecta
          </button>
        </motion.div>
      )}
      {state === 'changeCategoryModal' && (
        <div>
          <p>Modal de cambio de categoría</p>
          <button className=" mx-2 bg-black text-white" onClick={handleStay}>
            Permanecer en la categoría
          </button>
          <button
            className=" mx-2 bg-rose-700 text-white"
            onClick={handleDontAskAgain}
          >
            No volver a preguntar
          </button>
        </div>
      )}

      {state === 'motivationalMessage' && (
        <div>
          {context?.motivationalMessage !== null && (
            <div>
              <p>{context?.motivationalMessage?.title}</p>
              <p>{context?.motivationalMessage?.longMessage}</p>
              <p>{context?.motivationalMessage?.shortMessage}</p>
            </div>
          )}
        </div>
      )}

      {state === 'goalAchieved' && (
        <div className=" bg-white p-2">
          <p className=" text-black">GOAL ACHIEVED</p>
          <p className=" text-black font-bold ">{context?.currentMedal}</p>
        </div>
        // <MedalAchievementModal
        //   medal={checkMedalAchievement(score)}
        //   onContinue={() => send('SHOW_NEXT_QUESTION')}
        // />
      )}
    </div>
  )
  const {
    selectedCategory,
    updateAnsweredQuestions,
    updateCategoriesState,
    questions,
    categoriesState,
  } = useGameStore()
  const { config } = useConfigStore()
  const {
    gameState,
    setGameState,
    currentQuestion,
    setCurrentQuestion,
    answerSelected,
    setAnswerSelected,
    setShowExtraPoints,
    amountQuestionsAnswered,
    setAmountQuestionsAnswered,
  } = useQuestionStore()

  //const [state, send] = useMachine(gameMachine, {})

  const { countdownSeconds } = config
  const { calculateScore, updateScore } = useScoreManager()
  const { questionsAnswered } = useQuestionsAnswered(selectedCategory?.id)
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const {
    seconds: secondsLeft,
    reset: timerReset,
    pause: timerPause,
    isActive: timerIsActive,
  } = useCountdown(countdownSeconds, handleTimeUp)

  const categoryHasBonus = selectedCategory?.bonus

  //console.log('state: ', state.value)

  // useEffect(() => {

  // }, [state]);

  useEffect(() => {
    setShowExtraPoints(false)
    if (!questions || categoriesState?.length === 0) return

    const newQuestionIndex =
      categoriesState
        ?.find((cat) => cat.id === selectedCategory?.id)
        ?.questions.findIndex((q) => !q.completed) ?? 0
    setCurrentQuestionIndex(newQuestionIndex)
    setCurrentQuestion(questions?.[newQuestionIndex])
  }, [])

  const handleAnswerSelected = useCallback(
    (answerIndex: number) => {
      if (answerSelected !== null) return
      timerPause()
      setShowExtraPoints(true)
      setAnswerSelected(answerIndex)

      setAmountQuestionsAnswered(amountQuestionsAnswered + 1)

      const isCorrect =
        currentQuestion?.answers[answerIndex]?.isCorrect ?? false
      const questionsHasBonus = currentQuestion?.bonus ?? false
      const points = calculateScore(
        isCorrect,
        secondsLeft,
        questionsHasBonus,
        categoryHasBonus
      )
      updateScore(points)
      updateAnsweredQuestions(
        isCorrect
          ? questionsHasBonus || categoryHasBonus
            ? 'bonus'
            : 'correct'
          : 'incorrect'
      )
      updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
      setDirection(-1)
      setTimeout(() => {
        send({ type: 'ANSWER', isCorrect })
      }, 500)

      nextQuestion()
      // setTimeout(() => {
      //   nextQuestion()
      // }, 2000)
    },
    [
      answerSelected,
      amountQuestionsAnswered,
      calculateScore,
      currentQuestion,
      updateAnsweredQuestions,
      updateCategoriesState,
      selectedCategory,
      secondsLeft,
      categoryHasBonus,
    ]
  )

  const nextQuestion = useCallback(() => {
    setAnswerSelected(null)

    setTimeout(() => {
      if (questionsAnswered + 1 < questions?.length) {
        const newQuestionIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(newQuestionIndex)
        setCurrentQuestion(questions?.[newQuestionIndex])

        setShowExtraPoints(false)
        setTimeout(() => {
          send({ type: 'NEXT_QUESTION' })
        }, 2000)
        timerReset()
      } else {
        setGameState({ currentState: 'CAT_FINISHED' })
      }
    }, 2000)
  }, [
    questionsAnswered,
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    timerReset,
  ])

  function handleTimeUp() {
    //timerPause()
    updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
    updateAnsweredQuestions('incorrect')
    send({ type: 'ANSWER', isCorrect: false })

    nextQuestion()
    // setTimeout(nextQuestion, 2000)
  }

  // useEffect(() => {
  //   if (currentQuestion?.id) {
  //     //timerReset()
  //     setShowExtraPoints(false)
  //   }
  // }, [currentQuestion?.id])

  const getEncouragingMessage = (): EncouragingMessage | null => {
    const recentAnswers = state.context.recentAnswers
    if (recentAnswers.length < 3) return null

    const last3 = recentAnswers.slice(-3)
    if (last3.every((a) => a === 'correct')) {
      return ENCOURAGING_MESSAGES.correct['3']
    }
    if (last3.every((a) => a === 'incorrect')) {
      return ENCOURAGING_MESSAGES.incorrect['3']
    }
    return null
  }

  return (
    <div className="">
      <AnimatePresence mode="wait" custom={direction}>
        {state.matches('answering') && (
          <CardQuestion
            question={currentQuestion}
            onAnswer={handleAnswerSelected}
            secondsLeft={secondsLeft}
            timerIsActive={timerIsActive}
            direction={direction}
          />
        )}
        {state.matches('changeCategory') && (
          <ModalChangeCategory
            onRoulette={() => {
              router.push('/')
              // send({ type: 'CHANGE_CATEGORY' })
              // nextQuestion()
            }}
            onCloseModal={() => {
              send({ type: 'CLOSE_MODAL' })
              //send({ type: 'NEXT_QUESTION' })
              nextQuestion()
            }}
            onDontAskAgain={() => {
              send({ type: 'DONT_ASK_AGAIN' })
              nextQuestion()
            }}
          />
        )}
        {state.matches('encouragingMessage') && (
          <ModalEncouragingMessage
            encouragingMessage={getEncouragingMessage()}
            onCloseMessage={() => {
              //send({ type: 'CLOSE_MODAL' })
              send({ type: 'NEXT_QUESTION' })
              //nextQuestion()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
