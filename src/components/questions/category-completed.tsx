import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { useConfigStore } from '@/lib/config-store'
import Confetti from 'react-confetti'
import { Button } from '../ui/button'

export default function CategoryCompleted() {
  const navigate = useNavigate()
  const { resetGameState } = useQuestionStore()
  const { colors } = useConfigStore()

  return (
    <motion.div
      key="cat-completed"
      initial={{ opacity: 0, y: 300, scale: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -300 }}
      transition={{ duration: 0.5 }}
      className="z-[200] w-full min-h-[100dvh] flex items-center justify-center fixed top-0 left-0 px-2 bg-black/50 backdrop-blur-sm"
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={200}
        gravity={0.1}
      />
      <div className=" z-50 w-full h-full p-4 flex flex-col items-center justify-center gap-4  ">
        <h1
          className=" font-oswaldHeavyItalic text-[3.5rem] uppercase"
          style={{ color: colors.primary }}
        >
          Felicidades
        </h1>
        <p
          className=" w-5/6 font-tekoMedium text-4xl leading-8 uppercase text-center"
          style={{ color: colors.text }}
        >
          ¡Has completado toda la categoría!
        </p>
        <Button
          className="mt-10 px-8 py-6  font-oswaldMedium text-2xl uppercase rounded-full"
          style={{
            background: `linear-gradient(180deg, ${colors.primary} 60%, rgba(0, 0, 0, 1) 150%)`,
            color: colors.text,
          }}
          onClick={() => {
            resetGameState()
            navigate('/')
          }}
        >
          Girar la ruleta
        </Button>
      </div>
    </motion.div>
  )
}
