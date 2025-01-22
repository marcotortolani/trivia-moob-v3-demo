import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

import SliderRewards from '@/components/slider-rewards'

export default function Rewards() {
  const { colors, dictionary } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="rewards-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-[100dvh] flex flex-col items-center overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.background}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <section className="w-full max-w-2xl px-4 space-y-4">
          <h2
            className=" text-2xl font-oswaldBold uppercase text-left pb-2"
            style={{
              color: colors.text,
              borderBottom: `1.5px solid ${colors.primary}`,
            }}
          >
            {dictionary['Rewards']}
          </h2>
          <SliderRewards />
        </section>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
