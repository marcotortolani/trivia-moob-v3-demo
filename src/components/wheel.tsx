import { useState } from 'react'
import useSound from 'use-sound'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'

import ringWheel from '/img/default/anillo-ruleta.webp'
import indicatorCategory from '/img/default/senalador-categoria-anillo.webp'

import plasticSound from '../assets/sound/plastic-trash.mp3'
import rouletteSound from '../assets/sound/roulette_wheel.mp3'
import watterAttack from '../assets/sound/watter-attack.mp3'

const SPINS = 5
const TIME_SPINNING = 3000 // miliseconds
export function Wheel() {
  const navigate = useNavigate()
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const { setSelectedCategory, setQuestions, categoriesState } = useGameStore()
  const gameCompleted = useGameStore((state) =>
    state.categoriesState.every((category) => category.completed)
  )
  const { categories, colors, images, soundActive } = useConfigStore()

  const [playRoulette] = useSound(rouletteSound, { playbackRate: 1.1 })
  const [playLoad] = useSound(watterAttack, { playbackRate: 1.15 })

  function categoryCompleted(categoryID: number) {
    const totalQuestions =
      categories?.find((category) => category.id === categoryID)?.questions
        ?.length ?? 0
    const questionsAnswered =
      categoriesState
        ?.find((category) => category.id === categoryID)
        ?.questions?.filter((question) => question?.completed)?.length ?? 0
    return { questionsAnswered, totalQuestions }
  }

  const spinWheel = () => {
    if (isSpinning || gameCompleted) return
    setIsSpinning(true)
    if (soundActive) playRoulette()
    const degrees = 360 * SPINS + Math.floor(Math.random() * (360 - 1) + 1)
    const selectedIndex = Math.floor(
      ((rotation + degrees) % 360) / (360 / categories.length)
    )
    const selectedCategory = categories[selectedIndex]

    const { questionsAnswered, totalQuestions } = categoryCompleted(
      selectedCategory?.id
    )

    if (questionsAnswered >= totalQuestions) {
      spinWheel()
      return
    }

    setRotation((prev) => prev + degrees)

    setTimeout(() => {
      setIsSpinning(false)

      setSelectedCategory({
        id: selectedCategory.id,
        name: selectedCategory.name,
        bonus: selectedCategory.bonus,
        image: selectedCategory.imgURL,
      })
      setQuestions(selectedCategory?.questions)

      setTimeout(() => {
        if (soundActive) playLoad()
        navigate('/questions')
      }, 500)
    }, TIME_SPINNING)
  }

  // Get Offset - correction angle by sections amount
  const getOffset = (sections: number) => {
    switch (sections) {
      case 4:
        return 0
      case 5:
        return 18
      case 6:
        return 30
      case 7:
        return 38.5
      case 8:
        return 45
      default:
        return 0
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -1000, rotate: -540 }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: 0,
        transition: {
          duration: 0.7,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 100,
          damping: 10,
        },
      }}
      className=" h-full flex-1 flex items-center justify-center bg-red-600/0"
    >
      <div className="relative w-80 h-80 mx-auto my-8 scale-100  md:scale-125 ">
        <img
          src={ringWheel}
          alt="Ring wheel"
          className=" absolute z-50 w-full scale-110 p-0.5 "
        />
        <motion.div
          className="w-full h-full rounded-full overflow-hidden scale-75"
          initial={{ rotate: rotation }}
          animate={{ rotate: rotation }}
          transition={{
            duration: TIME_SPINNING / 1000,
            ease: 'easeInOut',
          }}
        >
          <div
            className="relative z-0 w-full h-full  "
            style={{
              transform: `rotate(${getOffset(categories.length)}deg)`,
            }}
          >
            {categories.map((category, index) => {
              // Calcula el ángulo y la inclinación para cada segmento
              const totalCategories = categories.length
              const angle = 360 / totalCategories
              const skewY = 90 - angle
              const imageRotationBySec: { [key: number]: number[] } = {
                4: [-45, -45, -45, -45],
                5: [-60, -60, -60, -60, -60],
                6: [-60, -60, -60, -60, -60, -60],
                7: [-60, -60, -60, -60, -60, -60, -60],
                8: [-70, -70, -70, -70, -70, -70, -70, -70],
              }

              const bgColor =
                colors?.rouletteSection[index % colors?.rouletteSection.length]

              const { questionsAnswered, totalQuestions } = categoryCompleted(
                category?.id
              )

              return (
                <div
                  key={category.name}
                  className={` ${
                    questionsAnswered >= totalQuestions &&
                    ' brightness-[25%] grayscale-[0%]'
                  } absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-br from-transparent to-black/20`}
                  style={{
                    transform: `rotate(-${index * angle}deg) skew(${skewY}deg)`,
                    backgroundColor: bgColor,
                    zIndex: totalCategories + 5 - index,
                  }}
                >
                  {/* <span className=" absolute top-6 right-2 bg-white text-black z-50 ">
                    {questionsAnswered}/{totalQuestions}
                  </span> */}
                  <div
                    className=" z-50 absolute w-1/2 h-1/2 bg-red-600/0 aspect-square -translate-x-1/2 -translate-y-1/2 "
                    style={{
                      transform: ` skew(-${skewY}deg)`,
                      top: `calc(90% - ${4 - 0.25 * totalCategories + 2}rem  )`,
                      left: `calc(75% - ${3 - 0.1 * totalCategories + 1.4}rem)`,
                    }}
                  >
                    <p className="hidden -rotate-[60deg] bg-white">
                      {category.name}
                    </p>
                    <div className=" relative w-full h-full ">
                      <img
                        src={category?.imgURL}
                        alt={category.name}
                        className="w-full h-full -rotate-0 z-50  object-cover"
                        style={{
                          transform: `rotate(${imageRotationBySec[totalCategories][index]}deg)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
        <div className="absolute top-0 left-1/2 z-[60] transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ y: 10 }}
            animate={
              isSpinning
                ? {
                    y: ['0.5rem', '-1rem', '0.5rem'],
                    transition: {
                      duration: 0.8,
                      yoyo: Infinity,
                      repeat: Infinity,
                      ease: 'easeOut',
                    },
                  }
                : { y: 0 }
            }
          >
            <div
              className=" absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-6 mx-auto h-6 content-normal rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${colors.secondary}, 90%, #000)`,
              }}
            />
            <img
              src={indicatorCategory}
              alt="Logo"
              className=" block w-12 h-16 drop-shadow-[-2px_5px_5px_rgba(0,0,0,0.75)] "
            />
          </motion.div>
        </div>
        <SpinButton
          spinWheel={spinWheel}
          isSpinning={isSpinning}
          gameCompleted={gameCompleted}
          bgColor={colors?.secondary}
          imageSpin={images?.spinButton}
        />
      </div>
    </motion.div>
  )
}

const SpinButton = ({
  spinWheel,
  isSpinning,
  bgColor,
  imageSpin,
  gameCompleted,
}: {
  spinWheel: () => void
  isSpinning: boolean
  gameCompleted: boolean
  bgColor?: string
  imageSpin: string
}) => {
  const { soundActive } = useConfigStore()
  const [playButton] = useSound(plasticSound, { playbackRate: 1.05 })

  const onSpin = () => {
    if (soundActive) playButton()
    setTimeout(() => {
      spinWheel()
    }, 100)
  }

  return (
    <button
      onClick={gameCompleted ? () => {} : onSpin}
      disabled={isSpinning || gameCompleted}
      className={` ${
        isSpinning ? ' shadow-inner' : 'shadow-md'
      } z-[1000]  disabled:cursor-not-allowed disabled:grayscale-[50%] disabled:scale-95 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full  flex items-center justify-center text-2xl border-2 border-black shadow-black/60 transition-all duration-200 ease-in-out`}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {imageSpin ? (
        <img src={imageSpin} alt="Spin" width={60} height={60} />
      ) : (
        '🔄'
      )}
    </button>
  )
}
