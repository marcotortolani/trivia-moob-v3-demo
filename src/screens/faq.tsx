import { useState } from 'react'
import useSound from 'use-sound'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

import { FAQS, FaqType } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'
import { hexToRgb } from '@/lib/utils'

import rackingOpen from '../assets/sound/racking-open.mp3'
import rackingClose from '../assets/sound/racking-close.mp3'

export default function FAQ() {
  const { colors, soundActive } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const [playRackingOpen] = useSound(rackingOpen, { playbackRate: 1.35 })
  const [playRackingClose] = useSound(rackingClose, { playbackRate: 1.2 })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // Controla el tiempo entre cada elemento
      },
    },
  }

  const itemVariants = {
    hidden: (index: number) => ({
      x: index % 2 === 0 ? -200 : 200, // Alterna entre izquierda y derecha
      opacity: 0,
    }),
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.2,
        stiffness: 350,
        damping: 20,
        duration: 0.3,
        delay: (index + 1) * 0.1,
      },
    }),
  }

  const handleToggle = (index: number) => {
    if (openIndex === index) {
      if (soundActive) playRackingClose()
      setOpenIndex(null)
    } else {
      if (soundActive) playRackingOpen()
      setOpenIndex(index)
    }
  }

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

        <section className=" w-full max-w-xl mx-auto px-4 ">
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full text-2xl font-oswaldBold uppercase text-left pb-2"
            style={{
              color: colors.text,
              borderBottom: `1.5px solid ${colors.primary}`,
            }}
          >
            Preguntas Frecuentes
          </motion.h2>

          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 space-y-4"
          >
            {FAQS.map((faq: FaqType, index) => (
              <motion.li
                key={index}
                custom={index}
                variants={itemVariants}
                className={` border border-white/50  rounded-lg overflow-hidden`}
                style={{
                  background:
                    index % 2 === 0
                      ? `rgba(${hexToRgb(colors.primary)}, 1)`
                      : `rgba(${hexToRgb(colors.primary)}, 0.4)`,
                }}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full p-4 flex justify-between items-center text-left transition-colors"
                >
                  <span
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      className="w-5 h-5 "
                      style={{ color: colors.text }}
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-gray-300">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
