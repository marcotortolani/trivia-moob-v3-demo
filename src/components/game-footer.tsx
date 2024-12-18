import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { AnimateProgressive, AnimateSwitch } from './animated-number'
import { useQuestionsAnswered } from '@/hooks/useQuestionsAnswered'
import { useConfigStore } from '@/lib/config-store'

export function GameFooter() {
  const navigate = useNavigate()
  const { colors, images } = useConfigStore()
  const { score, selectedCategory } = useGameStore()
  const { questionsAnswered, totalQuestions } = useQuestionsAnswered(
    selectedCategory?.id
  )

  return (
    <motion.footer
      initial={{ y: 200 }}
      animate={{ y: 0, transition: { duration: 0.5 } }}
      className="p-2 bg-black"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <div className="max-w-3xl mx-auto mb-2 flex justify-between items-center gap-4 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className=" w-36 h-full -mr-4 p-0"
        >
          <img
            src={images.rouletteSpinAgain}
            alt="Roulette image Spin Again"
            className="w-full h-auto "
          />
        </Button>

        <div className="w-5/6 text-center">
          <div
            className="w-full max-w-[400px] aspect-[600/246] flex items-center justify-center overflow-hidden "
            style={{
              backgroundImage: `url(${images.backgroundPoints})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span
              className="mt-3 py-0.5 flex items-center font-oswaldMedium text-4xl text-center"
              style={{
                color: colors.text,
              }}
            >
              <AnimateProgressive value={score} />
            </span>
          </div>

          <div
            className=" font-oswaldMedium tracking-widest text-sm"
            style={{
              color: colors.text,
            }}
          >
            PUNTAJE
          </div>
        </div>

        <div
          className="  flex flex-col items-center font-oswaldRegular text-[0.7rem] uppercase"
          style={{ color: colors.text }}
        >
          <div
            className="z-0 relative w-[4.2rem] h-[4.2rem] flex flex-col items-center justify-center text-xl font-bold "
            style={{
              color: colors.text,
              backgroundImage: `url(${images.circleQuestionsCounter})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span className="w-fit px-1 flex items-center justify-center font-oswaldMedium text-2xl line-clamp-1 ">
              {questionsAnswered < 10 ? 0 : null}
              <AnimateSwitch value={questionsAnswered || 0} />/
            </span>
            <span className="w-fit px-1 text-base leading-3 font-oswaldBold">
              {totalQuestions}
            </span>
          </div>
          Preguntas
        </div>
      </div>
    </motion.footer>
  )
}
