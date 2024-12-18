'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useGameStateManager } from '../../app/hooks/useGameStateManager'
import { useScoreManager } from '../../app/hooks/useScoreManager'
import { Gamepad2, ArrowBigRightDash, RotateCcwIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { CardQuestion } from './card-question'
import { Timer } from '../timer'
import { useCountDown } from '@/app/hooks/useCountDown'
import { Button } from '../ui/button'
import { Checkbox } from '@radix-ui/react-checkbox'
import BadgeGlow from '../ui/badge-glow'
import { Question } from '@/lib/game-store'
import { useQuestionsAnswered } from '@/app/hooks/useQuestionsAnswered'

export function QuestionDisplay() {
  const router = useRouter()
  const { config } = useConfigStore()
  const { countdownSeconds, amountAnswersToChangeCategory } = config
  const {
    selectedCategory,
    questions,
    categoriesState,
    updateCategoriesState,
    updateAnsweredQuestions,
    // currentQuestionIndex,
    // setCurrentQuestionIndex,
  } = useGameStore()

  const { gameState, dispatch, handleQuestionAnswer, resetCategoryState } =
    useGameStateManager({ amountAnswersToChangeCategory })
  const { calculateScore, updateScore } = useScoreManager()
  const { questionsAnswered } = useQuestionsAnswered(selectedCategory?.id)

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExtraPoints, setShowExtraPoints] = useState(false)
  const { secondsLeft, isActive, pause, reset } = useCountDown(countdownSeconds)
  const [direction, setDirection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>()

  const categoryID: number = selectedCategory?.id ?? 0
  const categoryHasBonus = selectedCategory?.bonus

  useEffect(() => {
    if (!questions) return
    const newQuestionIndex = getRandomFreeIndexQuestion()
    setCurrentQuestion(questions?.[newQuestionIndex])
  }, [questions])

  // Lógica de manejo de tiempo
  useEffect(() => {
    if (secondsLeft === 0) {
      pause()
      handleTimeUp()
    }
  }, [secondsLeft])

  const handleTimeUp = () => {
    updateAnsweredQuestions('incorrect')
    setDirection(1)
    updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
    handleQuestionAnswer(false)

    setTimeout(handleNextQuestion, 1000)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    pause()
    setSelectedAnswer(answerIndex)

    const isCorrect = currentQuestion?.answers[answerIndex]?.isCorrect ?? false
    const questionsHasBonus = currentQuestion?.bonus ?? false

    const points = calculateScore(
      isCorrect,
      secondsLeft,
      questionsHasBonus,
      categoryHasBonus
    )

    updateScore(points)

    // Actualizar estado de respuestas
    updateAnsweredQuestions(
      isCorrect
        ? questionsHasBonus || categoryHasBonus
          ? 'bonus'
          : 'correct'
        : 'incorrect'
    )

    updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)

    setDirection(1)
    setShowExtraPoints(true)

    handleQuestionAnswer(
      isCorrect,
      () => pause(),
      () => setTimeout(handleNextQuestion, 2000)
    )
  }

  const getRandomFreeIndexQuestion = (): number => {
    const randomIndex = Math.floor(Math.random() * questions.length)
    // if (!questions?.length || !categoriesState) return 0
    const randomQuestion = categoriesState[categoryID]?.questions?.[randomIndex]

    console.log('randomIndex', randomIndex)
    console.log('randomQuestion', randomQuestion)
    if (randomQuestion?.completed) return getRandomFreeIndexQuestion()

    return randomIndex
  }

  const handleNextQuestion = () => {
    if (questionsAnswered < questions?.length) {
      const newQuestionIndex = getRandomFreeIndexQuestion()
      setCurrentQuestion(questions?.[newQuestionIndex])

      setSelectedAnswer(null)
      setDirection(-1)
      setShowExtraPoints(false)
      reset()
    } else {
      dispatch({
        type: 'SET_STATE',
        payload: 'CAT-FINISHED',
      })
      dispatch({
        type: 'SET_MESSAGE',
        payload: '¡Has completado todas las preguntas de esta categoría!',
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 overflow-hidden ">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-pink-600 rounded-full p-2">
            <Gamepad2 className="w-6 h-6 text-pink-600" />
          </div>
          <span className="text-xl">
            <span className="text-pink-500">CATEGORÍA</span>{' '}
            <span className="text-white uppercase">
              {selectedCategory?.name}
            </span>
          </span>
        </div>
      </div>
      {gameState.currentState === 'PLAYING' && (
        <AnimatePresence mode="wait" custom={direction}>
          <CardQuestion
            key={currentQuestion?.id}
            question={currentQuestion}
            questionID={currentQuestion?.id ?? 0}
            categoryHasBonus={categoryHasBonus}
            onAnswerSelect={handleAnswerSelect}
            // selectedAnswer={selectedAnswer}
            timeUp={gameState.timeUp}
          >
            <div className="mb-2 flex justify-end">
              <Timer
                secondsLeft={secondsLeft}
                isActive={isActive}
                showExtraPoints={showExtraPoints}
              />
            </div>
            {categoryHasBonus && (
              <div className="absolute top-0 left-0 flex justify-end">
                <BadgeGlow>¡BONUS!</BadgeGlow>
              </div>
            )}
          </CardQuestion>
        </AnimatePresence>
      )}

      {gameState.currentState === 'MESSAGE' && (
        <motion.div
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 500 }}
          className="bg-white rounded-lg p-6 shadow-lg text-neutral-800"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            {gameState.message}
          </h2>
        </motion.div>
      )}

      {gameState.currentState === 'CAT-FINISHED' && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg text-white"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            {gameState.message}
          </h2>
          <Button
            onClick={() => {
              router.push('/')
            }}
          >
            Seguir en otra Categoria
          </Button>
        </motion.div>
      )}

      {gameState.currentState === 'CHANGE-CAT' && !gameState.dontAskAgain && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg text-white"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            {gameState.message}
          </h2>
          <div className="flex flex-col justify-center items-center gap-6">
            <Button
              onClick={() => {
                router.push('/')
              }}
              className="text-pink-500"
            >
              Girar la ruleta
              <RotateCcwIcon className="w-6 h-6 ml-2" />
            </Button>
            <Button
              onClick={() => {
                resetCategoryState()
                handleNextQuestion()
              }}
              className="bg-pink-500 max-w-md"
            >
              Continuar misma categoría
              <ArrowBigRightDash className="w-6 h-6 ml-2" />
            </Button>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="dontAskAgain"
                checked={gameState.dontAskAgain}
                onCheckedChange={() => {
                  dispatch({ type: 'TOGGLE_DONT_ASK_AGAIN' })
                  dispatch({ type: 'SET_STATE', payload: 'PLAYING' })
                  handleNextQuestion()
                }}
                className={`${
                  gameState.dontAskAgain
                    ? 'bg-sky-500 border-2 border-white'
                    : 'bg-white '
                }  w-5 h-5 rounded-md transition-all duration-200 ease-in-out`}
              />
              <label
                htmlFor="dontAskAgain"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No volver a preguntar
              </label>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}


