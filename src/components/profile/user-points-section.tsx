import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { AnimateProgressive } from '../animated-number'
import goldenRing from '/img/default/anillo-ruleta.webp'

export default function UserPoints() {
  const { colors, images, user } = useConfigStore()
  const { score } = useGameStore()
  const [points, setPoints] = useState(0)

  useEffect(() => {
    setPoints(score)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0.5, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg px-0 flex items-center justify-between "
    >
      <div className=" w-1/3 flex flex-col items-center justify-center ">
        <div className=" relative w-4/6 max-w-[100px] aspect-square">
          <img
            src={goldenRing}
            alt="Ring wheel"
            className=" absolute z-50 w-full h-full p-1   "
          />
          <img
            className="w-full h-full p-2 bg-black/0 backdrop-brightness-150 rounded-full "
            src={images.avatars[0]}
            alt="Image User Avatar"
          />
        </div>
        <span
          className=" font-oswaldMedium uppercase tracking-wider "
          style={{ color: colors.text }}
        >
          {user.userName}
        </span>
      </div>
      <div className=" ml-1 mr-3 w-[1px] h-16 bg-neutral-400 content-normal"></div>

      <div className=" relative px-2 w-3/5  mx-auto flex flex-col items-center  ">
        <div className=" relative ">
          <img src={images.backgroundPointsMenu} alt="background points" />
          <span
            className="absolute ml-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] xs:text-3xl font-oswaldBold"
            style={{ color: colors.text }}
          >
            <AnimateProgressive value={points} />
          </span>
        </div>
        <span
          className=" font-oswaldMedium uppercase tracking-wider "
          style={{ color: colors.text }}
        >
          Puntaje
        </span>
      </div>
    </motion.section>
  )
}
