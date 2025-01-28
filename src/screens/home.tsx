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
import LatestSelectedCategory from '@/components/home/latest-selected-category'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { colors, images } = useConfigStore()
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
        className={`relative min-h-[100dvh]  flex flex-col items-center overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.background}, #000)`,
        }}
      >
        {images.backgroundApp.length > 0 && (
          <img
            src={images.backgroundApp}
            alt="Background App Image"
            className="absolute top-0 object-center object-cover lg:object-fill w-full max-w-screen-xl mx-auto h-full"
          />
        )}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {gameCompleted && <GameCompletedModal />}
        <Wheel />
        {selectedCategory.name && <LatestSelectedCategory />}
        <Footer />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
