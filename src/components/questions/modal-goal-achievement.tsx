import { useLottie } from 'lottie-react'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { MEDAL_THRESHOLDS } from '@/lib/questions/questions-constants'

import goldMedal from '@/assets/lotties/gold-medal.json'
import silverMedal from '@/assets/lotties/silver-medal.json'
import copperMedal from '@/assets/lotties/copper-medal.json'

export default function ModalGoalAchievement({
  medal = '',
}: {
  medal: string | null
}) {
  const { colors, images } = useConfigStore()
  const options = {
    animationData: goldMedal,
    loop: true,
    autoplay: true,
  }
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
      className="absolute top-0 z-50 w-screen min-h-screen bg-gradient-to-b from-black/30 to-black/90 backdrop-blur-sm px-2 flex flex-col items-center justify-center pb-2"
    >
      <div className="relative z-0 flex items-center justify-center -mb-10 -mt-10 ">
        <div className=" absolute bottom-0 w-4/5 mb-10 md:mb-28 ">{View}</div>
        <img
          src={'../src/assets/img/default/3d-cylinder-podium-white.webp'}
          alt="3D Cylinder Podium image"
          className=" w-5/6 mx-auto "
        />
      </div>
      <div className=" relative w-4/6 mb-8 mx-auto  ">
        <img src={images.backgroundPointsMenu} alt="medal" />
        <span className="absolute ml-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-oswaldBold">
          {(
            MEDAL_THRESHOLDS[medal as keyof typeof MEDAL_THRESHOLDS].scoreGoal /
            1000
          ).toFixed(3)}
        </span>
      </div>
      <div className="px-4 space-y-2">
        <p
          className=" text-4xl leading-9 font-oswaldHeavyItalic uppercase text-center"
          style={{ color: colors.text }}
        >
          ¡Cumpliste el objetivo {goalName}!
        </p>
        <p
          className=" text-4xl leading-9 font-oswaldHeavyItalic uppercase text-center"
          style={{
            color: colors.primary,
          }}
        >
          {MEDAL_THRESHOLDS[medal as keyof typeof MEDAL_THRESHOLDS].message}
        </p>
      </div>
      <div className="mt-5 text-4xl">🎉 🌟 🔥 🚀 😎</div>
    </motion.div>
  )
}
