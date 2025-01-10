import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/header'
import { Wheel } from '@/components/wheel'
import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { GameCompletedModal } from '@/components/game-completed-modal'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { colors } = useConfigStore()
  const { selectedCategory } = useGameStore()
  const gameCompleted = useGameStore((state) =>
    state.categoriesState.every((category) => category.completed)
  )

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
        {selectedCategory.name && <LastSelectedCategory />}
        <Footer />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}

function LastSelectedCategory() {
  const { colors } = useConfigStore()
  const { selectedCategory } = useGameStore()

  return (
    <motion.div
      layout
      key="selected-category"
      initial={{ opacity: 0, y: 1000 }}
      animate={{ opacity: 1, y: -10 }}
      transition={{
        duration: 0.75,
        ease: 'easeInOut',
        delay: 0.25,
        type: 'spring',
        stiffness: 60,
      }}
      exit={{ opacity: 0, y: 1000 }}
      className="z-0 w-full md:w-fit mx-auto md:px-8 py-1 md:py-1.5 text-center font-oswaldRegular mb-0 md:rounded-full"
      style={{ backgroundColor: colors.primaryLight, color: colors.text }}
    >
      Última categoría jugada:{' '}
      <span className=" font-oswaldHeavyItalic text-xl ">
        {selectedCategory.name}
      </span>
    </motion.div>
  )
}
