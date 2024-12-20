import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CardQuestion } from './card-question'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { useScoreManager } from '@/hooks/useScoreManager'
import { useCountdown } from '@/hooks/useCountDown'
import { useQuestionsAnswered } from '@/hooks/useQuestionsAnswered'
import ModalChangeCategory from './modal-change-category'
import ModalMotivationalMessage from './modal-motivational-message'

// import { gameMachine } from '@/lib/questions/game-machine'
import ENCOURAGING_MESSAGES from '@/data/encouraging-messages.json'

import { useStateMachine } from '@/hooks/useStateMachine'
import ModalGoalAchievement from './modal-goal-achievement'

import goldenRing from '/img/default/anillo-ruleta.webp'

type ValidSizes = keyof (typeof ENCOURAGING_MESSAGES)['correct' | 'incorrect']
export type EncouragingMessage = (typeof ENCOURAGING_MESSAGES)[
  | 'correct'
  | 'incorrect'][ValidSizes]

export function PlayingScreen() {
  const navigate = useNavigate()
  const {
    selectedCategory,
    updateAnsweredQuestions,
    updateCategoriesState,
    questions,
    categoriesState,
  } = useGameStore()
  const { config, colors } = useConfigStore()
  const {
    // gameState,
    setGameState,
    currentQuestion,
    setCurrentQuestion,
    answerSelected,
    setAnswerSelected,
    setShowExtraPoints,
    // amountQuestionsAnswered,
    // setAmountQuestionsAnswered,
  } = useQuestionStore()

  const { state, send, context } = useStateMachine('answering')

  const { countdownSeconds } = config
  const { calculateScore, updateScore } = useScoreManager()
  const { questionsAnswered } = useQuestionsAnswered(selectedCategory?.id)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const {
  //  seconds: secondsLeft,
    reset: timerReset,
    pause: timerPause,
    isActive: timerIsActive,
  } = useCountdown(countdownSeconds, () => {})

  const secondsLeft = 0

  const categoryHasBonus = selectedCategory?.bonus

  const handleTimeUp = () => {
    updateCategoriesState(selectedCategory?.id, currentQuestion?.id ?? 0)
    updateAnsweredQuestions('incorrect')
    send('TIME_UP')

    setTimeout(() => {
      nextQuestion()
    }, 2500)
  }

  useEffect(() => {
    if (secondsLeft === 0) {
      handleTimeUp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

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

    //setAmountQuestionsAnswered(amountQuestionsAnswered + 1)

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
    if (state === 'answering') {
      //handlePlaying()
      console.log(' ---- ---- ----- --> PLAYING')
    }
    if (state === 'motivationalMessage') {
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
    } else {
      setGameState({ currentState: 'CAT_COMPLETED' })
    }
  }

  return (
    <motion.div
      key="playing-screen"
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 500 }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        {state !== 'answering' && (
          <>
            <motion.div
              key="category-selected"
              initial={{ opacity: 0, scale: 0.5, y: 1000 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: 'easeInOut',
                  delay: 0,
                  type: 'spring',
                  stiffness: 40,
                },
              }}
              className=" flex items-center justify-center gap-2 "
            >
              <div className=" relative w-1/6 max-w-[100px] aspect-square">
                <img
                  src={goldenRing}
                  alt="Ring wheel"
                  className=" absolute z-50 w-full h-full p-1  "
                />
                <img
                  className="w-full h-full"
                  src={selectedCategory?.image}
                  alt={selectedCategory?.name}
                />
              </div>
              <span
                className=" font-oswaldBold italic tracking-wider text-lg "
                style={{ color: colors.text }}
              >
                {selectedCategory.name}
              </span>
            </motion.div>
            <CardQuestion
              question={currentQuestion}
              onAnswer={handleAnswerSelected}
              secondsLeft={secondsLeft}
              timerIsActive={timerIsActive}
              direction={direction}
            />
          </>
        )}
        {state === 'changeCategoryModal' && (
          <ModalChangeCategory
            onRoulette={() => navigate('/')}
            onCloseModal={() => send('STAY')}
            onDontAskAgain={() => send('DONT_ASK_AGAIN')}
          />
        )}
        {state === 'motivationalMessage' && (
          <ModalMotivationalMessage
            encouragingMessage={context?.motivationalMessage}
          />
        )}

        {state === 'goalAchieved' && (
          <ModalGoalAchievement medal={context?.currentMedal} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
