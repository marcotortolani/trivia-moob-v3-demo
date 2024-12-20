import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { StartScreen } from './start-screen'
import { PlayingScreen } from './playing-screen'

import { useGameStore } from '@/lib/game-store'
import CategoryCompleted from './category-completed'

export function QuestionDisplay() {
  const { gameState, setGameState, resetGameState } = useQuestionStore()
  const { selectedCategory } = useGameStore()
  const categoryCompleted = useGameStore(
    (state) =>
      state.categoriesState.find(
        (category) => category.id === selectedCategory?.id
      )?.completed
  )

  useEffect(() => {
    resetGameState()
    if (categoryCompleted) {
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

        {gameState.currentState === 'PAUSE' && (
          <motion.div
            key="pause-screen"
            initial={{ opacity: 0, y: 500 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 500 }}
          >
            <div>
              <h2>Juego en pausa</h2>
              <button onClick={() => setGameState({ currentState: 'PLAYING' })}>
                Reanudar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
