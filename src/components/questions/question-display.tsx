import { useEffect } from 'react'
import useSound from 'use-sound'
import { AnimatePresence } from 'framer-motion'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { StartScreen } from './start-screen'
import { PlayingScreen } from './playing-screen'

import CategoryCompleted from './category-completed'

import confettiSound from '../../assets/sound/confetti-sound.mp3'

export function QuestionDisplay() {
  const { soundActive } = useConfigStore()
  const { gameState, setGameState, resetGameState } = useQuestionStore()
  const { selectedCategory } = useGameStore()
  const categoryCompleted = useGameStore(
    (state) =>
      state.categoriesState.find(
        (category) => category.id === selectedCategory?.id
      )?.completed
  )

  const [playConfetti] = useSound(confettiSound, { volume: 0.5 })

  useEffect(() => {
    resetGameState()
    if (categoryCompleted) {
      if (soundActive) playConfetti()
      setGameState({ currentState: 'CAT_COMPLETED' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryCompleted])

  return (
    <div className="w-full max-w-2xl mx-auto px-0 overflow-hidden2 ">
      <AnimatePresence mode="wait">
        {gameState.currentState === 'START' && <StartScreen />}
        {gameState.currentState === 'PLAYING' && <PlayingScreen />}
        {gameState.currentState === 'CAT_COMPLETED' && <CategoryCompleted />}

        {/* {gameState.currentState !== 'PAUSE' && (
          <motion.div
            key="pause-screen"
            initial={{ opacity: 0, y: 500 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 500 }}
          >
            <div className="w-full max-w-2xl mx-auto px-0 flex flex-col items-center justify-center gap-10 overflow-hidden2 ">
              <h2>Juego en pausa</h2>
              <button
                className=" px-6 py-2 bg-slate-400 font-bold text-black uppercase rounded-lg"
                onClick={() => setGameState({ currentState: 'PLAYING' })}
              >
                Reanudar
              </button>
            </div>
          </motion.div>
        )} */}
      </AnimatePresence>
    </div>
  )
}
