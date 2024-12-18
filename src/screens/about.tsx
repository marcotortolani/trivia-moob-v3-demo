import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

export default function About() {
  const { colors } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-screen flex flex-col overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <h2
          className=" mx-auto text-2xl font-bold text-center mb-2"
          style={{ color: colors.text }}
        >
          Acerca de...
        </h2>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
