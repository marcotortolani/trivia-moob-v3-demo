import useSound from 'use-sound'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'

import goldenRing from '/img/default/anillo-ruleta.webp'

import blopSound from '@/assets/sound/blop.mp3'

const StartScreen = () => {
  const { colors, soundActive, dictionary } = useConfigStore()
  const { selectedCategory } = useGameStore()
  const { setGameState } = useQuestionStore()

  const [playButton] = useSound(blopSound)

  const handleBegin = () => {
    if (soundActive) playButton()
    setGameState({ currentState: 'PLAYING' })
  }

  return (
    <motion.div
      key="start-screen"
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 500 }}
      className="flex-1 flex flex-col items-center justify-center gap-2 p-4 "
    >
      <p
        className="text-center text-3xl xs:text-4xl xs:leading-[3.2rem] uppercase font-oswaldMedium italic tracking-wide -mb-2 xs:-mb-6 "
        style={{ color: colors.text }}
      >
        {dictionary['Category']}
      </p>
      <h2
        className="w-[95%] text-center text-wrap text-4xl xs:text-[3.2rem] xs:leading-[4rem] uppercase font-oswaldBold italic tracking-wide -mb-4 "
        style={{
          color: colors.title,
        }}
      >
        {selectedCategory?.name}
      </h2>
      <div
        key="category-selected"
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
      </div>

      <Button
        onClick={handleBegin}
        className=" px-10 py-8 shadow-md shadow-black/60 uppercase text-3xl xs:text-4xl font-oswaldMedium tracking-wide rounded-full"
        style={{
          background: colors.nextBtnGradient,
          color: colors.text,
        }}
      >
        {dictionary['Start']}
      </Button>
    </motion.div>
  )
}

export default StartScreen
