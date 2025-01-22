import { useState, useEffect } from 'react'
import useSound from 'use-sound'

import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'

import { Header } from '@/components/header'
import { GameFooter } from '@/components/game-footer'
import { Sidebar } from '@/components/sidebar'

import { StartScreen } from '@/components/questions/start-screen'
import { PlayingScreen } from '@/components/questions/playing-screen'
import CategoryCompleted from '@/components/questions/category-completed'

import confettiSound from '../assets/sound/confetti-sound.mp3'

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { colors, soundActive } = useConfigStore()
  const { gameState } = useQuestionStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { selectedCategory, questions } = useGameStore()

  const [playConfetti] = useSound(confettiSound, { volume: 0.5 })

  useEffect(() => {
    if (gameState.currentState === 'CAT_COMPLETED') {
      if (soundActive) playConfetti()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState])

  useEffect(() => {
    if (!selectedCategory || questions?.length === 0) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="z-50 min-h-[100dvh] flex flex-col"
      style={{
        background: `linear-gradient(to bottom, ${colors.background}, #000)`,
        color: colors.text,
      }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.main
          layout
          // key={`questions-page-${selectedCategory?.id}`}
          key="questions-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5 } }}
          exit={{ scale: 0.5, opacity: 0, transition: { duration: 1.5 } }}
          className="z-50 w-full max-w-2xl mx-auto overflow-hidden2 flex-1 flex flex-col items-center justify-center p-0"
        >
          <AnimatePresence mode="wait">
            {gameState.currentState === 'START' && <StartScreen />}
            {gameState.currentState === 'PLAYING' && <PlayingScreen />}
            {gameState.currentState === 'CAT_COMPLETED' && (
              <CategoryCompleted />
            )}

            {/* {gameState.currentState !== 'PAUSE' && (
                <PauseScreen />
                  )} */}
          </AnimatePresence>
        </motion.main>
      </AnimatePresence>
      <GameFooter />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

// const PauseScreen = () => {
//   const { setGameState } = useQuestionStore()
//   return (
//     <motion.div
//       key="pause-screen"
//       initial={{ opacity: 0, y: 500 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 500 }}
//     >
//       <div className="w-full max-w-2xl mx-auto px-0 flex flex-col items-center justify-center gap-10 overflow-hidden2 ">
//         <h2>Juego en pausa</h2>
//         <button
//           className=" px-6 py-2 bg-slate-400 font-bold text-black uppercase rounded-lg"
//           onClick={() => setGameState({ currentState: 'PLAYING' })}
//         >
//           Reanudar
//         </button>
//       </div>
//     </motion.div>
//   )
// }
