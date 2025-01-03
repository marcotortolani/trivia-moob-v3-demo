import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

import { PlayCircleIcon, CheckCircleIcon } from 'lucide-react'

export default function Tutorial() {
  const { colors } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-[100dvh] mb-10 flex flex-col overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <section className=" w-full px-6 flex flex-col items-center gap-3">
          <h2
            className=" w-full text-2xl font-oswaldRegular text-left mb-2 pb-3  "
            style={{
              color: colors.text,
              borderBottom: `1.5px solid ${colors.primary}`,
            }}
          >
            ¿Cómo se juega?
          </h2>

          {/* Video tutorial */}
          <div className=" w-full aspect-video flex items-center justify-center bg-white rounded-xl">
            <PlayCircleIcon
              className=" w-1/2 h-1/2  "
              stroke={colors.primary}
            />
          </div>

          {/* Lista de pasos a seguir */}
          <ul className=" w-full flex flex-col gap-2 ">
            {Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className=" w-full py-2 flex flex-col items-start gap-2 "
              >
                <div className=" flex items-center gap-2">
                  <CheckCircleIcon
                    className=" w-6 h-6 "
                    stroke={colors.primary}
                  />
                  <span
                    className=" text-xl font-tekoMedium text-left "
                    style={{ color: colors.text }}
                  >
                    {index + 1} - Lorem ipsum dolor sit amet
                  </span>
                </div>
                <p
                  className=" text-sm font-oswaldRegular text-left"
                  style={{ color: colors.text }}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
                  voluptates quas, voluptatum quod, voluptas, quibusdam
                </p>
              </li>
            ))}
          </ul>
        </section>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
