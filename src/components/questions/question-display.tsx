import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { StartScreen } from './start-screen'
import { PlayingScreen } from './playing-screen'
import { Button } from '../ui/button'
import { useGameStore } from '@/lib/game-store'

export function QuestionDisplay() {
  const navigate = useNavigate()
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
      setGameState({ currentState: 'CAT_FINISHED' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryCompleted])

  return (
    <div className="w-full max-w-2xl mx-auto px-0 overflow-hidden2 ">
      <AnimatePresence mode="wait">
        {gameState.currentState === 'START' && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 500 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 500 }}
          >
            <StartScreen />
          </motion.div>
        )}
        {gameState.currentState === 'PLAYING' && (
          <motion.div
            key="playing-screen"
            initial={{ opacity: 0, y: 500 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 500 }}
          >
            <PlayingScreen />
          </motion.div>
        )}

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

        {gameState.currentState === 'CAT_FINISHED' && (
          <motion.div
            key={'cat-finished'}
            initial={{ opacity: 0, y: 300, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -300 }}
            transition={{ duration: 0.5 }}
            className="z-50 w-full h-full flex items-center justify-center fixed top-0 left-0 px-2 bg-black/50 backdrop-blur-sm"
          >
            <div className=" w-full bg-white text-black p-4 ">
              <h2>¡Categoría completada!</h2>
              <Button
                className="font-semibold bg-pink-600 text-white"
                onClick={() => {
                  resetGameState()
                  navigate('/')
                }}
              >
                Girar la ruleta
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
