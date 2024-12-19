import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { MEDAL_THRESHOLDS } from '@/lib/questions/questions-constants'

import goldMedalPodium from '/img/default/objetivo-oro.webp'
import silverMedalPodium from '/img/default/objetivo-plata.webp'
import copperMedalPodium from '/img/default/objetivo-cobre.webp'
import greenCheck from '/img/default/correct-icon.webp'
import { hexToRgb } from '@/lib/utils'

export default function Ranking() {
  const { colors, categories, config } = useConfigStore()
  const { score } = useGameStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isRankingData = true

  const totalQuestionsGame = categories.reduce((total, category) => {
    return total + category.questions.length
  }, 0)

  const medalsToAchieve = [
    {
      name: 'Oro',
      image: goldMedalPodium,
      points:
        MEDAL_THRESHOLDS.gold.percentageGoal *
        totalQuestionsGame *
        config.pointsCorrect,
    },
    {
      name: 'Plata',
      image: silverMedalPodium,
      points:
        MEDAL_THRESHOLDS.silver.percentageGoal *
        totalQuestionsGame *
        config.pointsCorrect,
    },
    {
      name: 'Cobre',
      image: copperMedalPodium,
      points:
        MEDAL_THRESHOLDS.copper.percentageGoal *
        totalQuestionsGame *
        config.pointsCorrect,
    },
  ]

  const rankingData = [
    {
      name: 'Jugador 1',
      image: 'https://avatar.iran.liara.run/public/24',
      score: 10500,
    },
    {
      name: 'Jugador 2',
      image: 'https://avatar.iran.liara.run/public/83',
      score: 9500,
    },
    {
      name: 'Jugador 3',
      image: 'https://avatar.iran.liara.run/public/54',
      score: 9200,
    },
    {
      name: 'Jugador 4',
      image: 'https://avatar.iran.liara.run/public/64',
      score: 9000,
    },
    {
      name: 'Jugador 5',
      image: 'https://avatar.iran.liara.run/public/45',
      score: 8500,
    },
    {
      name: 'Jugador 6',
      image: 'https://avatar.iran.liara.run/public/50',
      score: 8000,
    },
    {
      name: 'Jugador 7',
      image: 'https://avatar.iran.liara.run/public/72',
      score: 7500,
    },
    {
      name: 'Jugador 8',
      image: 'https://avatar.iran.liara.run/public/41',
      score: 7000,
    },
    {
      name: 'Jugador 9',
      image: 'https://avatar.iran.liara.run/public/40',
      score: 6500,
    },
    {
      name: 'Jugador 10',
      image: 'https://avatar.iran.liara.run/public/22',
      score: 6000,
    },
  ]

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-[100dvh] pb-10 flex flex-col overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <section className="px-4">
          <h2
            className=" pl-3 text-2xl font-oswaldBold uppercase text-left"
            style={{
              color: colors.text,
              borderBottom: `1px solid ${colors.primary}`,
            }}
          >
            Objetivos
          </h2>
          <div className=" w-full px-4 py-4 space-y-1">
            {medalsToAchieve.map((medal) => (
              <div className={` w-full mx-auto flex items-center gap-2 `}>
                <img
                  src={medal.image}
                  alt="Medal with Black Podium"
                  className={
                    `${score >= medal.points && ' grayscale-[70%] '}` +
                    ' w-2/5  '
                  }
                />
                <div className=" ">
                  {score >= medal.points ? (
                    <div
                      className="px-3 py-0.5 pr-2 flex items-center gap-2  rounded-full"
                      style={{ backgroundColor: colors.correct }}
                    >
                      <p
                        className="mt-0.5 uppercase font-tekoRegular "
                        style={{ color: colors.text }}
                      >
                        Objetivo Cumplido
                      </p>
                      <img
                        src={greenCheck}
                        alt="Green Check image"
                        className=" w-5 h-5"
                      />
                    </div>
                  ) : (
                    <p
                      className=" font-oswaldRegular text-lg"
                      style={{
                        color: colors.text,
                      }}
                    >
                      Alcanza los
                    </p>
                  )}

                  <div>
                    <img src="/" alt="" />
                    <span
                      className=" font-oswaldBold text-4xl"
                      style={{
                        color: colors.text,
                      }}
                    >
                      {(medal.points / 1000).toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isRankingData && (
          <section className="px-4">
            <h2
              className=" pl-3 text-2xl font-oswaldBold uppercase text-left"
              style={{
                color: colors.text,
                borderBottom: `1px solid ${colors.primary}`,
              }}
            >
              Ranking
            </h2>

            <div
              className=" w-full py-4 space-y-4"
              style={{ color: colors.text }}
            >
              {rankingData.map((player, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 && 'bg-gray-500'
                  } px-2 py-2 flex items-center justify-between rounded-xl`}
                  style={{
                    background:
                      index % 2 === 0
                        ? `rgba(${hexToRgb(colors.primary)}, 1)`
                        : `rgba(${hexToRgb(colors.primary)}, 0.4)`,
                  }}
                >
                  <div className=" flex items-center gap-2">
                    <span className=" mr-3 font-tekoMedium text-xl">
                      {index + 1}
                    </span>
                    <img
                      src={player.image}
                      alt=""
                      className=" w-10 h-10 rounded-full"
                    />
                    <span className=" font-tekoRegular text-lg ">
                      {player.name}
                    </span>
                  </div>
                  <div className=" w-1/6 h-[1px] bg-white"></div>
                  <p>
                    <span className=" font-tekoRegular text-lg ">
                      {player.score}
                    </span>{' '}
                    puntos
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
