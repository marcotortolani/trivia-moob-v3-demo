import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'

import goldenRing from '@/assets/img/default/anillo-ruleta.webp'

export const StartScreen = () => {
  const { colors } = useConfigStore()
  const { selectedCategory } = useGameStore()
  const { setGameState } = useQuestionStore()

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4">
      <h2
        className="text-center text-[4rem] font-oswaldBold italic tracking-wide -mb-4 "
        style={{
          color: colors.title,
        }}
      >
        {selectedCategory?.name}
      </h2>
      <motion.div
        key="category-selected"
        initial={{ opacity: 0, scale: 0.5, rotate: -900 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.75, ease: 'easeInOut', delay: 0.25 },
        }}
        className=" relative w-2/3 max-w-[350px] aspect-square"
      >
        <img
          src={goldenRing}
          alt="Ring wheel"
          className=" absolute z-50 w-full h-full p-3  "
        />
        {selectedCategory?.image ? (
          <img
            className="w-full h-full"
            src={selectedCategory?.image}
            alt={selectedCategory?.name}
          />
        ) : (
          <div
            className="w-full h-full rounded-full "
            style={{ backgroundColor: colors.primary }}
          ></div>
        )}
      </motion.div>

      <Button
        onClick={() => setGameState({ currentState: 'PLAYING' })}
        className=" px-10 py-8 uppercase text-4xl font-oswaldMedium tracking-wide rounded-full"
        style={{
          background: colors.nextBtnGradient,
          color: colors.text,
        }}
      >
        Comenzar
      </Button>
    </div>
  )
}
