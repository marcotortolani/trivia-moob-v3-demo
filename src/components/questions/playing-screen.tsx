import { lazy, useEffect, useState } from 'react'
import useSound from 'use-sound'
import { AnimatePresence, motion } from 'framer-motion'

import { useStateMachine } from '@/hooks/useStateMachine'
import { useScoreManager } from '@/hooks/useScoreManager'
import { CardQuestion } from './card-question'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { useCountdown } from '@/hooks/useCountDown'
import { useQuestionsAnswered } from '@/hooks/useQuestionsAnswered'

const ModalChangeCategory = lazy(() => import('./modal-change-category'))
const ModalMotivationalMessage = lazy(
  () => import('./modal-motivational-message')
)
const ModalGoalAchievement = lazy(() => import('./modal-goal-achievement'))

import swooshLong from '@/assets/sound/swoosh.mp3'
import swooshShort from '@/assets/sound/swoosh-2.mp3'
import failureTimeup from '@/assets/sound/failure-defeat.mp3'
import positiveSound from '@/assets/sound/button_sound.mp3'
import victorySound from '@/assets/sound/tada-result.mp3'
import CategorySelectedHeader from './category-selected-header'

export default function PlayingScreen() {
  const {
    selectedCategory,
    updateAnsweredQuestions,
    updateCategoriesState,
    getQuestions,
    categoriesState,
    timeSpent,
    updateTimeSpent,
  } = useGameStore()
  const { config, soundActive } = useConfigStore()
  const {
    setGameState,
    currentQuestion,
    setCurrentQuestion,
    answerSelected,
    setAnswerSelected,
    setShowExtraPoints,
  } = useQuestionStore()

  const { state, send, context } = useStateMachine('answering')

  const questions = getQuestions()

  const { countdownSeconds } = config
  const { calculateScore, updateScore } = useScoreManager()
  const { questionsAnswered } = useQuestionsAnswered(selectedCategory?.id)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const {
    seconds: secondsLeft,
    reset: timerReset,
    pause: timerPause,
    isActive: timerIsActive,
  } = useCountdown(countdownSeconds, handleTimeUp)

  const [playSwooshShort] = useSound(swooshShort, { playbackRate: 1.1 })
  const [playSwooshLong] = useSound(swooshLong, { playbackRate: 1.1 })
  const [playTimeup] = useSound(failureTimeup, { playbackRate: 0.9 })
  const [playPositive] = useSound(positiveSound)
  const [playVictory] = useSound(victorySound, { playbackRate: 1.2 })

  const categoryHasBonus = selectedCategory?.bonus

  function handleTimeUp() {
    if (soundActive) playTimeup()
    updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
    updateAnsweredQuestions('incorrect')
    send('TIME_UP')

    setTimeout(() => {
      nextQuestion()
    }, 2500)
  }

  useEffect(() => {
    setShowExtraPoints(false)
    if (!questions || categoriesState?.length === 0) return

    const newQuestionIndex =
      categoriesState
        ?.find((cat) => cat.id === selectedCategory?.id)
        ?.questions.findIndex((q) => !q.completed) ?? 0
    setCurrentQuestionIndex(newQuestionIndex)
    setCurrentQuestion(questions?.[newQuestionIndex])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAnswerSelected = (answerIndex: number, isCorrect: boolean) => {
    if (answerSelected !== null) return
    timerPause()
    setShowExtraPoints(true)
    setAnswerSelected(answerIndex)
    updateTimeSpent(timeSpent + (countdownSeconds - secondsLeft))

    const questionsHasBonus = currentQuestion?.bonus ?? false
    const pointsUpdated = calculateScore(
      isCorrect,
      secondsLeft,
      questionsHasBonus,
      categoryHasBonus
    )
    updateScore(pointsUpdated)
    updateAnsweredQuestions(
      isCorrect
        ? questionsHasBonus || categoryHasBonus
          ? 'bonus'
          : 'correct'
        : 'incorrect'
    )
    updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
    setDirection(-1)
    send(isCorrect ? 'ANSWER_CORRECT' : 'ANSWER_INCORRECT', {
      score: pointsUpdated,
    })
  }

  useEffect(() => {
    if (state === 'nextQuestion' || state === 'goalAchieved') {
      timerPause()
      nextQuestion()
    }
    if (state === 'goalAchieved') {
      // play victory sound
      if (soundActive) playVictory()
    }
    if (state === 'changeCategoryModal') {
      if (soundActive) playSwooshLong()
    }
    // if (state === 'answering') {
    //   //handlePlaying()
    // }
    if (state === 'motivationalMessage') {
      if (soundActive) playPositive()
      setTimeout(() => {
        send('SHOW_NEXT_QUESTION')
      }, 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const nextQuestion = () => {
    setAnswerSelected(null)
    timerPause()

    if (questionsAnswered < questions?.length) {
      const newQuestionIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(newQuestionIndex)
      setCurrentQuestion(questions?.[newQuestionIndex])
      setShowExtraPoints(false)
      send('SHOW_NEXT_QUESTION')
      timerReset()
      if (soundActive) playSwooshShort()
    } else {
      setTimeout(() => {
        setGameState({ currentState: 'CAT_COMPLETED' })
      }, 500)
    }
  }

  return (
    <motion.div
      key="playing-screen"
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 500 }}
      className=" z-0 w-full"
    >
      <AnimatePresence mode="wait" custom={direction}>
        {state === 'answering' && (
          <>
            <CategorySelectedHeader />
            <CardQuestion
              question={currentQuestion}
              onAnswer={(answerIndex, isCorrect) =>
                handleAnswerSelected(answerIndex, isCorrect)
              }
              secondsLeft={secondsLeft}
              timerIsActive={timerIsActive}
              direction={direction}
            />
          </>
        )}
        {state === 'changeCategoryModal' && (
          <ModalChangeCategory
            onRoulette={() => (window.document.location.href = '/trivia')}
            onCloseModal={() => send('STAY')}
            onDontAskAgain={() => send('DONT_ASK_AGAIN')}
          />
        )}
        {state === 'motivationalMessage' && (
          <ModalMotivationalMessage
            motivationalMessage={context?.motivationalMessage}
          />
        )}

        {state === 'goalAchieved' && (
          <ModalGoalAchievement medal={context?.currentMedal} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
