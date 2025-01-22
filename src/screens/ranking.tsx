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
import { User } from 'lucide-react'

export default function Ranking() {
  const { colors } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isRankingData = true

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="ranking-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative w-full min-h-[100dvh] pb-10 flex flex-col  `}
        style={{
          background: `linear-gradient(to bottom, ${colors.background}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className=" w-full max-w-screen-sm mx-auto lg:px-6 xl:px-4 lg:mt-10 xl:mt-2 lg:max-w-screen-lg flex flex-col lg:flex-row items-start justify-center ">
          <MedalsSection />
          {isRankingData && <RankingSection />}
        </div>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}

const MedalsSection = () => {
  const { colors, config, categories, dictionary } = useConfigStore()
  const { score } = useGameStore()

  const totalQuestionsGame = categories.reduce((total, category) => {
    return total + category.questions.length
  }, 0)

  const medalsToAchieve = [
    {
      name: dictionary['Gold'],
      image: goldMedalPodium,
      points:
        MEDAL_THRESHOLDS.gold.percentageGoal *
        totalQuestionsGame *
        config.pointsCorrect,
    },
    {
      name: dictionary['Silver'],
      image: silverMedalPodium,
      points:
        MEDAL_THRESHOLDS.silver.percentageGoal *
        totalQuestionsGame *
        config.pointsCorrect,
    },
    {
      name: dictionary['Copper'],
      image: copperMedalPodium,
      points:
        MEDAL_THRESHOLDS.copper.percentageGoal *
        totalQuestionsGame *
        config.pointsCorrect,
    },
  ]
  return (
    <section className="px-4">
      <motion.h2
        key="achieve-title"
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -200 }}
        className=" text-2xl font-oswaldBold uppercase text-left pb-2"
        style={{
          color: colors.text,
          borderBottom: `1.5px solid ${colors.primary}`,
        }}
      >
        {dictionary['Goals']}
      </motion.h2>
      <div className=" w-full px-4 py-4 space-y-1">
        {medalsToAchieve.map((medal, index) => (
          <motion.div
            key={medal.name}
            layout
            initial={{ opacity: 0, y: -200 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, delay: (3 - index) * 0.25 },
            }}
            exit={{ opacity: 0, y: -200 }}
            className={` w-full mx-auto flex items-center gap-2 `}
          >
            <img
              src={medal.image}
              alt="Medal with Black Podium"
              className={
                `${score >= medal.points && ' grayscale-[70%] '}` + ' w-2/5  '
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
                    {dictionary['Goal Achieved']}
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
                  {dictionary['Reach']}
                </p>
              )}

              <div>
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
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const RankingSection = () => {
  const { colors, images, user, categories, config, dictionary } =
    useConfigStore()
  const { score } = useGameStore()

  const totalQuestionsGame = categories.reduce((total, category) => {
    return total + category.questions.length
  }, 0)

  const avatarImages = images.avatars

  const rankingData = [
    {
      name: dictionary['Player'] + ' 1',
      image: avatarImages[8],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.1 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 2',
      image: avatarImages[3],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.152 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 3',
      image: avatarImages[6],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.22 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 4',
      image: avatarImages[2],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.375 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 5',
      image: avatarImages[1],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.432 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 6',
      image: avatarImages[9],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.567 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 7',
      image: avatarImages[5],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.658 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 8',
      image: avatarImages[10],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.723 * config.pointsCorrect,
    },
    {
      name: dictionary['Player'] + ' 9',
      image: avatarImages[7],
      score:
        totalQuestionsGame * config.pointsCorrect -
        totalQuestionsGame * 0.868 * config.pointsCorrect,
    },
  ]

  rankingData.push({
    name: user.userName,
    image: user.userAvatar,
    score: score,
  })

  rankingData.sort((a, b) => b.score - a.score)

  return (
    <section className=" w-full max-w-screen-sm mx-auto px-4">
      <motion.h2
        key="ranking-title"
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -200 }}
        className=" text-2xl font-oswaldBold uppercase text-left pb-2"
        style={{
          color: colors.text,
          borderBottom: `1.5px solid ${colors.primary}`,
        }}
      >
        {dictionary['Ranking']}
      </motion.h2>

      <div className=" w-full py-4 space-y-4" style={{ color: colors.text }}>
        {rankingData.map((player, index) => {
          return (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, x: 200 * (index % 2 === 0 ? 1 : -1) }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.25, delay: index * 0.25 },
              }}
              whileHover={{ scale: 1.05 }}
              className={`${index % 2 === 0 && 'bg-gray-500'} ${
                player.name === user.userName &&
                ' filter brightness-150 outline outline-3 outline-yellow-500 '
              } px-2 md:px-4 py-2 flex items-center justify-between gap-4 xs:gap-0 rounded-xl cursor-default`}
              style={{
                background:
                  player.name === user.userName
                    ? colors.background
                    : index % 2 === 0
                    ? `rgba(${hexToRgb(colors.primary)}, 1)`
                    : `rgba(${hexToRgb(colors.primary)}, 0.4)`,
              }}
            >
              <div className=" flex items-center gap-2">
                <span className=" mr-3 font-tekoMedium tracking-wide text-xl lg:text-2xl">
                  {index + 1}
                </span>
                {player.image === '' ? (
                  <div className=" w-10 h-10">
                    <User
                      size={50}
                      stroke={colors.text}
                      className="w-auto h-full aspect-square p-2 rounded-full"
                      style={{ background: colors.primary, color: colors.text }}
                    />
                  </div>
                ) : (
                  <img
                    src={player.image}
                    alt=""
                    className=" w-10 h-10 rounded-full"
                  />
                )}
              </div>
              <div className=" w-4/6 xs:w-3/4 flex flex-col xs:flex-row items-center justify-between ">
                <span className=" font-tekoRegular tracking-wider text-lg lg:text-xl ">
                  {player.name === user.userName
                    ? dictionary['You']
                    : player.name}
                </span>
                <div className=" w-1/2 xs:w-1/6 h-[1px] bg-white"></div>
                <p>
                  <span className=" font-tekoRegular text-lg lg:text-xl ">
                    {parseFloat(player.score.toFixed(2))}
                  </span>{' '}
                  {dictionary['points']}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
