import { useLottie } from 'lottie-react'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { MEDAL_THRESHOLDS } from '@/lib/questions/questions-constants'

import goldMedal from '@/assets/lotties/gold-medal.json'
import silverMedal from '@/assets/lotties/silver-medal.json'
import copperMedal from '@/assets/lotties/copper-medal.json'

import podium3D from '/img/default/base-podio.webp'

export default function ModalGoalAchievement({
  medal = '',
}: {
  medal: string | null
}) {
  const { colors, images, config, categories } = useConfigStore()
  const options = {
    animationData: goldMedal,
    loop: true,
    autoplay: true,
  }

  const totalQuestionsGame = categories.reduce((total, category) => {
    return total + category.questions.length
  }, 0)
  let goalName = ''

  switch (medal) {
    case MEDAL_THRESHOLDS.gold.type:
      options.animationData = goldMedal
      goalName = 'Dorado'
      break
    case MEDAL_THRESHOLDS.silver.type:
      options.animationData = silverMedal
      goalName = 'Plateado'
      break
    case MEDAL_THRESHOLDS.copper.type:
      options.animationData = copperMedal
      goalName = 'Cobre'
      break
  }

  const { View } = useLottie(options)

  return (
    <motion.div
      initial={{ opacity: 0, y: 1000 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 z-[200] w-screen min-h-[100dvh]  px-2 pb-10 flex flex-col items-center justify-center lg:gap-8 bg-gradient-to-b from-black/10 via-black/30 to-black backdrop-blur-sm"
    >
      <div className="relative z-0 h-fit flex flex-col items-center justify-center mb-2  ">
        <div className="  w-4/5 lg:w-full lg:max-w-[400px] -mb-20 -mt-10 lg:-mb-28 lg:-mt-20 ">{View}</div>
        <img
          src={podium3D}
          alt="3D Cylinder Podium image"
          className=" w-2/3 mx-auto"
        />
      </div>
      <div className=" relative w-4/6 max-w-[300px] mb-10 mx-auto ">
        <img src={images.backgroundPointsMenu} alt="medal" />
        <span className="absolute ml-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl xs:text-4xl lg:text-5xl font-oswaldBold">
          {(
            (MEDAL_THRESHOLDS[medal as keyof typeof MEDAL_THRESHOLDS]
              .percentageGoal *
              totalQuestionsGame *
              config.pointsCorrect) /
            1000
          ).toFixed(3)}
        </span>
      </div>
      <div className="px-4 space-y-2 lg:space-y-6">
        <p
          className=" text-2xl leading-7 xs:text-4xl xs:leading-9 lg:text-5xl font-oswaldHeavyItalic uppercase text-center"
          style={{ color: colors.text }}
        >
          ¡Cumpliste el objetivo {goalName}!
        </p>
        <p
          className=" text-2xl leading-7 xs:text-4xl xs:leading-9 lg:text-5xl font-oswaldHeavyItalic uppercase text-center"
          style={{
            color: colors.primary,
          }}
        >
          {MEDAL_THRESHOLDS[medal as keyof typeof MEDAL_THRESHOLDS].message}
        </p>
      </div>
      <div className="mt-5 text-4xl lg:text-5xl">🎉 🌟 🔥 🚀 😎</div>
    </motion.div>
  )
}
