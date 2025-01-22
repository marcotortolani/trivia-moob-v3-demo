import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import SectionTitle from './section-title'

import correctIcon from '/img/default/correct-icon.webp'
import incorrectIcon from '/img/default/incorrect-icon.webp'
import bonusIcon from '/img/default/bonus-icon.webp'

export default function PointsInfo() {
  const { colors, config, dictionary } = useConfigStore()
  return (
    <motion.section
      initial={{ opacity: 0, x: 500 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.25,
          delay: 0,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 120,
          damping: 20,
        },
      }}
      className=" w-full max-w-lg px-4 mb-0  "
    >
      <div
        className="w-full p-2 flex items-center justify-between gap-4 rounded-xl "
        style={{ border: `2px solid ${colors?.primaryLight}` }}
      >
        <SectionTitle title={dictionary['Points per Answer']} />
        <div className=" w-fit ml-2 h-full flex flex-col items-center justify-center ">
          <img
            className=" w-[10vw] min-w-[30px] max-w-[50px] aspect-square"
            src={correctIcon}
            alt="Image Correct Icon"
          />
          <span
            className="text-sm font-oswaldMedium"
            style={{ color: colors?.text }}
          >
            {config.pointsCorrect}
          </span>
        </div>
        <div className=" w-fit h-full flex flex-col items-center justify-center ">
          <img
            className=" w-[10vw] min-w-[30px] max-w-[50px] aspect-square"
            src={incorrectIcon}
            alt="Image Incorrect Icon"
          />
          <span
            className="text-sm font-oswaldMedium"
            style={{ color: colors?.text }}
          >
            {config.pointsWrong}
          </span>
        </div>
        <div className=" w-fit h-full flex flex-col items-center justify-center">
          <img
            className=" w-[10vw] min-w-[30px] max-w-[50px] aspect-square"
            src={bonusIcon}
            alt="Image Bonus Icon"
          />
          <span
            className="text-sm font-oswaldMedium"
            style={{ color: colors?.text }}
          >
            {config.pointsCorrect + config.pointsBonus}
          </span>
        </div>
      </div>
    </motion.section>
  )
}
