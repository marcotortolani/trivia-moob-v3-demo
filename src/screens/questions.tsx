import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'

import { Header } from '@/components/header'
import { QuestionDisplay } from '@/components/questions/question-display'
import { GameFooter } from '@/components/game-footer'
import { Sidebar } from '@/components/sidebar'

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { colors } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { selectedCategory, questions } = useGameStore()

  useEffect(() => {
    if (!selectedCategory || questions?.length === 0) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        color: colors.text,
      }}
    >
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.main
          layout
          key={`questions-page-${selectedCategory?.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5 } }}
          exit={{ scale: 0.5, opacity: 0, transition: { duration: 1.5 } }}
          className="flex-1 flex flex-col items-center justify-center p-0"
        >
          <QuestionDisplay />
        </motion.main>
      </AnimatePresence>
      <GameFooter />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
