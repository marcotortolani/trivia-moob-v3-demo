'use client'

import { useEffect, useState, useMemo } from 'react'
import { CardQuestion } from './card-question'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'

import { useScoreManager } from '@/app/hooks/useScoreManager'
import { useCountDown } from '@/app/hooks/useCountDown'
import { useQuestionsAnswered } from '@/app/hooks/useQuestionsAnswered'
import { getRandomFreeIndexQuestion } from '@/lib/questions/questions-utils'
import { AnimatePresence, motion } from 'framer-motion'
import { time } from 'console'

export function PlayingScreen() {
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
    setShowExtraPoints,
  } = useQuestionStore()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const { pointsCorrect, pointsWrong, pointsBonus, countdownSeconds } = config
  const { calculateScore, updateScore } = useScoreManager()
  const { questionsAnswered } = useQuestionsAnswered(selectedCategory?.id)
  const [direction, setDirection] = useState(0)

  const {
    secondsLeft,
    reset: timerReset,
    pause: timerPause,
    resume: timerResume,
    isActive: timerIsActive,
  } = useCountDown(countdownSeconds)

  const categoryHasBonus = useMemo(() => {
    return selectedCategory?.bonus
  }, [selectedCategory])

  const handleAnswerSelected = (answerIndex: number) => {
    //if (selectedAnswer !== null) return
    timerPause()
    console.log('handleAnswerSelected', answerIndex)

    //setShowExtraPoints(true)

    //setSelectedAnswer(answerIndex)
    const isCorrect = currentQuestion?.answers[answerIndex]?.isCorrect ?? false
    const questionsHasBonus = currentQuestion?.bonus ?? false
    // const points = calculateScore(
    //   isCorrect,
    //   secondsLeft,
    //   questionsHasBonus,
    //   categoryHasBonus
    // )
    //updateScore(points)
    // Actualizar estado de respuestas
    // updateAnsweredQuestions(
    //   isCorrect
    //     ? questionsHasBonus || categoryHasBonus
    //       ? 'bonus'
    //       : 'correct'
    //     : 'incorrect'
    // )
    // Agregar respuesta a las respuestas recientes
    // dispatch({
    //   type: 'UPDATE_RECENT_ANSWERS',
    //   payload: isCorrect ? 'correct' : 'incorrect',
    // })
    //updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)

    //timerPause()
    //setDirection(-1)
    //TODO Si está marcado "no preguntar de nuevo", omitir el cambio de categoría
    // if (gameState.dontAskAgain) {
    //   nextQuestion?.()
    //   return
    // }
    // const isCategoryChange =
    //   gameState.questionsAnswered + 1 ===
    //   initialConfig.amountAnswersToChangeCategory
    // if (isCategoryChange) {
    //   // Pausar el temporizador si se proporciona el método
    //   onPause?.()
    //   setTimeout(() => {
    //     dispatch({ type: 'SET_STATE', payload: 'CHANGE-CAT' })
    //     dispatch({ type: 'SET_MESSAGE', payload: '¡Cambia de categoría!' })
    //   }, 1000)
    // } else if (gameState.currentState === 'PLAYING') {
    //   nextQuestion?.()
    // }

    const timer = setTimeout(() => {
      //setShowExtraPoints(false)
      //setSelectedAnswer(null)
      nextQuestion()
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }

  const addRecentAnswer = (newAnswer: string) => {
    setGameState({
      recentAnswers: [...gameState.recentAnswers, newAnswer],
    })
  }

  function handleTimeUp() {
    timerPause()
    // dispatch({ type: 'SET_STATE', payload: 'TIME_UP' })
    // dispatch({ type: 'SET_MESSAGE', payload: '¡Se acabó el tiempo!' })
    // setDirection(1)
    // updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)

    // updateAnsweredQuestions('incorrect')
    addRecentAnswer('incorrect')

    const timer = setTimeout(() => {
      nextQuestion()
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }

  useEffect(() => {
    if (secondsLeft === 0) {
      console.log('handleTimeUp')

      handleTimeUp()
      setGameState({ currentState: 'CHANGE_CAT' })
    }
  }, [secondsLeft])

  const nextQuestion = () => {
    console.log('nextQuestion')

    if (questionsAnswered + 1 < questions?.length) {
      const newQuestionIndex = getRandomFreeIndexQuestion({
        selectedCategory,
        categoriesState,
      })
      console.log('-------> newQuestionIndex', newQuestionIndex)
      const newQuestion = questions?.[newQuestionIndex]
      setCurrentQuestion(newQuestion)
      //  setSelectedAnswer(null)
      //    setDirection(-1)
      //      setShowExtraPoints(false)
    } else {
      timerPause()
      console.log('FINISHED')
      setGameState({ currentState: 'CAT_FINISHED' })
      // dispatch({ type: 'SET_STATE', payload: 'CAT_FINISHED' })
    }

    timerReset()
  }

  return (
    <div className=" ">
      <div
        className={`${
          timerIsActive ? 'bg-red-500' : 'bg-neutral-500'
        }  text-white px-3 py-1`}
      >
        <span>{secondsLeft}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 1000 }}
          transition={{ duration: 0.5 }}
        >
          <div className=" bg-white rounded-lg p-6 shadow-lg">
            <h2 className=" text-black">{currentQuestion?.title}</h2>
            <button
              type="button"
              onClick={() => handleAnswerSelected(1)}
              className=" bg-rose-500 text-black"
            >
              Next question
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
