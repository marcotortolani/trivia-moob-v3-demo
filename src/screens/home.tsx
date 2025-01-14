import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/header'
import { Wheel } from '@/components/home/wheel'
import { Footer } from '@/components/home/footer'
import { Sidebar } from '@/components/sidebar'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { useQuestionStore } from '@/lib/questions/questions-store'
import { GameCompletedModal } from '@/components/home/game-completed-modal'
import LastestSelectedCategory from '@/components/home/latest-selected-category'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { colors } = useConfigStore()
  const { selectedCategory } = useGameStore()
  const { resetGameState } = useQuestionStore()
  const gameCompleted = useGameStore((state) =>
    state.categoriesState.every((category) => category.completed)
  )

  useEffect(() => {
    return () => {
      resetGameState()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-[100dvh]  flex flex-col overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {gameCompleted && <GameCompletedModal />}
        <Wheel />
        {selectedCategory.name && <LastestSelectedCategory />}
        <Footer />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
