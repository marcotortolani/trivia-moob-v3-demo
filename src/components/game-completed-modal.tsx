import useSound from 'use-sound'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useLottie } from 'lottie-react'
import { Button } from './ui/button'
import { Sidebar } from './sidebar'

import gameFinished from '../assets/lotties/game-finished.json'
import blopSound from '../assets/sound/blop.mp3'

export function GameCompletedModal() {
  const { resetGame } = useGameStore()
  const { colors, soundActive } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [playButton] = useSound(blopSound)

  const options = {
    animationData: gameFinished,
    loop: true,
    autoplay: true,
  }
  const { View } = useLottie(options)
  function handleReset() {
    resetGame()
  }
  return (
    <motion.div
      key="game-completed-modal"
      initial={{ opacity: 0, y: -1000, scale: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -1000, scale: 0 }}
      className=" absolute top-0  z-50 w-full min-h-[100dvh] pt-28 pb-10 overflow-y-scroll flex flex-col items-center justify-between bg-gradient-to-b from-black/50 via-black/75 to-black backdrop-blur-sm  backdrop-brightness-75"
    >
      <motion.div
        initial={{ opacity: 0, y: -500, scale: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className=" w-full mx-auto h-full px-6 pt-2 pb-10 flex flex-col items-center justify-center"
      >
        <p
          className="px-4 pt-1 text-2xl uppercase font-tekoMedium text-center mb-2 rounded-lg"
          style={{
            color: colors.text,
            background: `linear-gradient(180deg, ${colors.primary} 60%, rgb(0, 0, 0,1) 150%)`,
          }}
        >
          Lo has logrado
        </p>

        <div className=" w-3/4 max-w-[250px]">{View}</div>

        <div className=" w-full mb-4">
          <h2
            className=" font-oswaldHeavyItalic text-4xl uppercase text-center"
            style={{ color: colors.primary }}
          >
            ¡Felicidades!
          </h2>
          <p
            className=" font-oswaldHeavyItalic text-4xl leading-9 uppercase text-center"
            style={{ color: colors.text }}
          >
            ¡Completaste <br /> la trivia!
          </p>
        </div>

        <p
          className=" font-tekoRegular text-lg uppercase mb-4"
          style={{ color: colors.text }}
        >
          ¿Te gustaría jugar nuevamente?
        </p>
        <Button
          onClick={() => {
            if (soundActive) playButton()
            handleReset()
          }}
          className=" h-fit px-8 pt-1 pb-0 font-tekoRegular text-3xl uppercase rounded-full"
          style={{
            background: `linear-gradient(180deg, ${colors.primary} 60%, rgb(0, 0, 0,1) 150%)`,
            color: colors.text,
          }}
        >
          Resetear Trivia
        </Button>
      </motion.div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </motion.div>
  )
}
