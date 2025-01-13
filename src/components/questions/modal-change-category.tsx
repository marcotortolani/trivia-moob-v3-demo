import useSound from 'use-sound'
import { motion } from 'framer-motion'
import { useLottie } from 'lottie-react'
import { useConfigStore } from '@/lib/config-store'

import rouletteLottie from '../../assets/lotties/roulette-spin-again.json'
import { Checkbox } from '../ui/checkbox'

import blopSound from '../../assets/sound/blop.mp3'

interface ModalChangeCategoryProps {
  onRoulette: () => void
  onCloseModal: () => void
  onDontAskAgain: () => void
}

const ModalChangeCategory: React.FC<ModalChangeCategoryProps> = ({
  onRoulette,
  onCloseModal,
  onDontAskAgain,
}) => {
  const { config, colors, soundActive } = useConfigStore()

  const [playButton] = useSound(blopSound)

  const options = {
    animationData: rouletteLottie,
    loop: true,
    autoplay: true,
  }
  const { View } = useLottie(options)
  return (
    <motion.div
      initial={{ y: 500, scale: 0.25, opacity: 0 }}
      animate={{
        y: 0,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      }}
      exit={{ y: -500, scale: 0.25, opacity: 0 }}
      className="absolute top-0 left-0 z-[2000] w-full min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-black/20 to-black/90 backdrop-blur-sm "
    >
      <div className=" w-full max-w-md h-full px-4 py-8 flex flex-col items-center justify-center gap-4 lg:gap-6 rounded-lg ">
        <p
          className=" mx-4 px-2 xs:px-5 pt-5 py-3.5 font-tekoMedium uppercase text-xl xs:text-2xl leading-6 text-center rounded-xl"
          style={{
            background: `linear-gradient(180deg, ${colors.primary} 60%, rgba(0,0,0,1) 150%`,
            color: colors.text,
          }}
        >
          Ya respondiste {config.amountAnswersToChangeCategory} preguntas en
          esta categoría
        </p>
        <h2
          className=" w-5/6 mt-3 uppercase text-2xl xs:text-3xl font-oswaldHeavyItalic leading-7 text-center "
          style={{
            color: colors.text,
          }}
        >
          ¿Te gustaría volver a tirar la ruleta?
        </h2>
        <div className=" w-3/5 max-w-[250px]">{View}</div>

        <button
          onClick={() => {
            if (soundActive) playButton()
            onRoulette()
          }}
          className=" px-6 xs:px-10 pt-2 xs:pt-3 pb-1 uppercase font-tekoMedium text-2xl xs:text-5xl text-nowrap shadow-md shadow-black/50 rounded-full "
          style={{
            color: colors.text,
            background: `linear-gradient(180deg, ${colors.primary} 60%, rgba(0,0,0,1) 160%`,
          }}
        >
          Volver a tirar
        </button>

        <button
          onClick={() => {
            if (soundActive) playButton()
            onCloseModal()
          }}
          className="mt-2 px-6 py-0.5 bg-neutral-400 uppercase font-tekoRegular text-lg xs:text-2xl shadow-md shadow-black/50 rounded-full "
          style={{ color: colors.text }}
        >
          Continuar en Categoría actual
        </button>

        <div className="mt-4 flex items-center gap-3">
          <Checkbox
            id="dont-ask-again"
            onCheckedChange={() => {
              if (soundActive) playButton()
              setTimeout(() => {
                onDontAskAgain()
              }, 100)
            }}
            className=" w-5 h-5 xs:w-6 xs:h-6  bg-transparent border-2 border-white rounded-lg accent-rose-500 text-rose-400"
          />
          <p className=" font-tekoRegular uppercase text-lg xs:text-2xl">
            No volver a preguntarme
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ModalChangeCategory
