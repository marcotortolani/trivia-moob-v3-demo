import { motion } from 'framer-motion'
import useSound from 'use-sound'
import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { AnimateProgressive, AnimateSwitch } from './animated-number'
import { useQuestionsAnswered } from '@/hooks/useQuestionsAnswered'
import { useConfigStore } from '@/lib/config-store'

import blopSound from '@/assets/sound/blop.mp3'

export function GameFooter() {
  const { colors, images, soundActive, dictionary } = useConfigStore()
  const { score, selectedCategory } = useGameStore()
  const { questionsAnswered, totalQuestions } = useQuestionsAnswered(
    selectedCategory?.id
  )

  const [playButton] = useSound(blopSound)

  function handleHomeClick() {
    if (soundActive) playButton()
    window.document.location.href = '/trivia/'
  }

  return (
    <motion.footer
      key="game-footer"
      initial={{ y: 200 }}
      animate={{ y: 0, transition: { duration: 0.5 } }}
      className="z-0 p-2 bg-transparent"
    >
      <div className="w-full max-w-3xl mx-auto mb-2 flex justify-between items-center gap-4 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeClick}
          className=" w-36 md:w-40 h-full -mr-4 p-0 hover:bg-transparent active:bg-transparent hover:scale-105 active:scale-100 transition-all duration-150 ease-in-out"
        >
          <img
            src={images.rouletteSpinAgain}
            alt="Roulette image Spin Again"
            className="w-full h-auto "
          />
        </Button>

        <div className="w-5/6  text-center">
          <div
            className="w-full max-w-[300px] mx-auto aspect-[600/246] flex items-center justify-center overflow-hidden "
            style={{
              backgroundImage: `url(${images.backgroundPoints})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span
              className="mt-2 xs:mt-3 md:mt-4 py-0.5 flex items-center font-oswaldMedium text-lg xs:text-4xl text-center"
              style={{
                color: colors.text,
              }}
            >
              <AnimateProgressive value={score} />
            </span>
          </div>

          <div
            className=" font-oswaldMedium uppercase tracking-widest text-xs xs:text-sm md:text-base"
            style={{
              color: colors.text,
            }}
          >
            {dictionary['Score']}
          </div>
        </div>

        <div
          className=" z-0  flex flex-col items-center font-oswaldRegular text-[0.6rem] xs:text-[0.7rem] md:text-base uppercase"
          style={{ color: colors.text }}
        >
          <div
            className="z-0 relative w-[3.8rem] h-[3.8rem] xs:w-[4.2rem] xs:h-[4.2rem] md:w-[5.2rem] md:h-[5.2rem] flex flex-col items-center justify-center "
            style={{
              color: colors.text,
              backgroundImage: `url(${images.circleQuestionsCounter})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span className="w-fit px-1 flex items-center justify-center font-oswaldMedium text-base xs:text-2xl line-clamp-1 ">
              {questionsAnswered < 10 ? 0 : null}
              <AnimateSwitch value={questionsAnswered || 0} />/
            </span>
            <span className="w-fit px-1 text-base md:text-lg leading-3 font-oswaldBold">
              {totalQuestions}
            </span>
          </div>
          {dictionary['Questions']}
        </div>
      </div>
    </motion.footer>
  )
}
