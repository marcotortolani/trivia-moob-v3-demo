import useSound from 'use-sound'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'

import goldenRing from '/img/default/anillo-ruleta.webp'

import buttonSound from '../../assets/sound/button_sound.mp3'

export const StartScreen = () => {
  const { colors, soundActive } = useConfigStore()
  const { selectedCategory } = useGameStore()
  const { setGameState } = useQuestionStore()

  const [playButton] = useSound(buttonSound)

  return (
    <motion.div
      key="start-screen"
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 500 }}
      className="flex-1 flex flex-col items-center justify-center gap-2 p-4 "
    >
      <p
        className="text-center text-4xl uppercase font-oswaldMedium italic tracking-wide -mb-6 "
        style={{ color: colors.text }}
      >
        Categoría
      </p>
      <h2
        className="w-[95%] text-center text-[3.2rem] uppercase font-oswaldBold italic tracking-wide -mb-4 "
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
        className=" relative w-3/5 max-w-[300px] my-4 aspect-square"
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
        onClick={() => {
          if (soundActive) playButton()
          setGameState({ currentState: 'PLAYING' })
        }}
        className=" px-10 py-8 shadow-md shadow-black/60 uppercase text-4xl font-oswaldMedium tracking-wide rounded-full"
        style={{
          background: colors.nextBtnGradient,
          color: colors.text,
        }}
      >
        Comenzar
      </Button>
    </motion.div>
  )
}
