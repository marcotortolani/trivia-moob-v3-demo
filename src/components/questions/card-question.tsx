import { useState, useEffect, useMemo } from 'react'
import useSound from 'use-sound'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { Timer } from '../timer'
import BadgeGlow from '../ui/badge-glow'
import { Question, Answer } from '@/types/game-types'
import TimeUp from './time-up'

import correctAnswer from '../../assets/sound/correct-answer.mp3'
import wrongAnswer from '../../assets/sound/wrong-answer.mp3'

export function CardQuestion({
  question,
  onAnswer,
  secondsLeft,
  timerIsActive,
  direction,
}: {
  question: Question | null
  onAnswer: (index: number, isCorrect: boolean) => void
  secondsLeft: number
  timerIsActive: boolean
  direction: number
}) {
  const { selectedCategory } = useGameStore()
  const { showExtraPoints } = useQuestionStore()
  const { colors } = useConfigStore()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  const [playCorrect] = useSound(correctAnswer)
  const [playWrong] = useSound(wrongAnswer)

  const categoryHasBonus = selectedCategory?.bonus
  const questionHasBonus = currentQuestion?.bonus

  const timeUp = useMemo(() => {
    return secondsLeft === 0
  }, [secondsLeft])

  const x = useMotionValue(0)
  const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])
  const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], { clamp: false })

  const handleAnswer = ({
    index,
    isCorrect,
  }: {
    index: number
    isCorrect: boolean
  }) => {
    setSelectedAnswer(index)
    if (isCorrect) {
      playCorrect()
    } else {
      playWrong()
    }
    
    // set delay time
    setTimeout(() => {
      onAnswer(index, isCorrect)
    }, 1000)
  }

  useEffect(() => {
    setSelectedAnswer(null)
    if (!question) return
    setCurrentQuestion(question)
    //setShowExtraPoints(false)
  }, [question, question?.id])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      transition: { duration: 1 },
    }),
  }

  if (!currentQuestion) {
    return <div>No hay preguntas disponibles</div>
  }

  return (
    <div className=" px-8 mt-5 mb-2">
      <motion.div
        key={`card-question-${currentQuestion?.id}`}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
        }}
        style={{
          width: '100%',
          x,
          rotate,
          background: timeUp
            ? `linear-gradient(to bottom, ${colors.wrong} 60%, #000 120%)`
            : `linear-gradient(to bottom, ${colors.primary} 70%, #000 220%)`,
          outlineColor: timeUp ? colors.wrong : colors.primary,
        }}
        className={`relative rounded-3xl p-6 outline-[6px] outline 
        ${timeUp ? 'animate-shake ' : ''}
      `}
      >
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 flex justify-end">
          <Timer
            secondsLeft={secondsLeft}
            isActive={timerIsActive}
            showExtraPoints={showExtraPoints}
          />
        </div>
        {(categoryHasBonus || questionHasBonus) && (
          <div className="absolute top-0 left-0 -translate-x-4 -translate-y-1/2 flex justify-end">
            <BadgeGlow>BONUS</BadgeGlow>
          </div>
        )}
        <motion.div style={{ scale }}>
          <h2
            className="text-xl font-oswaldMedium leading-6 text-center mb-6"
            style={{
              color: colors.text,
            }}
          >
            {currentQuestion?.title}
          </h2>

          <div className="grid gap-4">
            {currentQuestion?.answers.map((answer, index) => (
              <ButtonAnswer
                key={index}
                index={index}
                answer={answer}
                selectedAnswer={selectedAnswer}
                timeUp={timeUp}
                onSelectAnswer={() =>
                  handleAnswer({ index, isCorrect: answer.isCorrect })
                }
                questionHasBonus={currentQuestion?.bonus ?? false}
                categoryHasBonus={categoryHasBonus}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
      <TimeUp timeUp={timeUp} />
    </div>
  )
}

function ButtonAnswer({
  index,
  answer,
  selectedAnswer,
  timeUp,
  onSelectAnswer,
  questionHasBonus,
  categoryHasBonus,
}: {
  index: number
  answer: Answer
  selectedAnswer: number | null
  timeUp: boolean
  onSelectAnswer: () => void
  questionHasBonus: boolean
  categoryHasBonus: boolean
}) {
  const { config, colors } = useConfigStore()
  const { pointsCorrect, pointsWrong, pointsBonus } = config

  const styles = {
    default: {
      background: colors.answerBtnGradient,
    },
    correct: {
      background: `linear-gradient(to bottom, ${colors.correct} 60%, #000 120%)`,
    },
    incorrect: {
      background: `linear-gradient(to bottom, ${colors.wrong} 60%, #000 120%)`,
    },
  }

  return (
    <motion.button
      onClick={onSelectAnswer}
      disabled={selectedAnswer !== null || timeUp}
      className={` h-14 shadow-md shadow-black/50 text-xl font-oswaldMedium italic tracking-wide transition-all duration-100 ease-in-out rounded-full `}
      style={{
        color: colors.text,
        ...(selectedAnswer === index
          ? answer.isCorrect
            ? styles.correct
            : styles.incorrect
          : styles.default),
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: selectedAnswer !== null ? 1 : 0.95 }}
      animate={
        selectedAnswer === index
          ? answer.isCorrect
            ? {
                scale: [1, 1.2, 1, 0.9, 1, 1.2, 1],
                transition: { duration: 0.5 },
              }
            : {
                x: [0, -20, 20, -20, 20, 0],
                transition: { duration: 0.5 },
              }
          : {}
      }
    >
      {selectedAnswer === index
        ? answer.isCorrect
          ? questionHasBonus || categoryHasBonus
            ? `Extra Bonus: +${pointsCorrect + pointsBonus}`
            : `Correcta: +${pointsCorrect}`
          : `Incorrecta: +${pointsWrong}`
        : answer.text}
    </motion.button>
  )
}
