import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

import TimeSpent from '@/components/profile/time-spent-section'
import UserPoints from '@/components/profile/user-points-section'
import CategoriesProgress from '@/components/profile/categories-progress-section'
import AnswersType from '@/components/profile/answers-type-section'
import PointsInfo from '@/components/profile/points-info-section'

export default function Profile() {
  const { colors } = useConfigStore()
  const { categoriesState } = useGameStore()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const answeredQuestionsProgress = categoriesState?.reduce(
    (acc, category) =>
      acc + category.questions.filter((q) => q.completed).length,
    0
  )

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-[100dvh] flex flex-col items-center gap-4 overflow-hidden mb-10 `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <UserPoints />
        <CategoriesProgress
          answeredQuestionsProgress={answeredQuestionsProgress}
        />
        <AnswersType />
        <TimeSpent answeredQuestionsProgress={answeredQuestionsProgress} />
        <PointsInfo />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
