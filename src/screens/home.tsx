import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const navigate = useNavigate()
  //tomar datos desde el store
  // const { selectedCategory } = useGameStore()
  const { validPeriod } = useConfigStore()

  //  const { validPeriod } = useContext(ConfigContext) --> store
  const actualDate = new Date().getTime()
  const startDate = new Date(validPeriod.startDate).getTime()
  const endDate = new Date(validPeriod.endDate).getTime()

  if (actualDate < startDate) {
    navigate('/upcoming')
  }

  if (actualDate > endDate) {
    navigate('/ended')
  }

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
        {selectedCategory && <LastSelectedCategory />}
        <Footer />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}

// function GameCompletedModal() {
//   const { resetGame } = useGameStore()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   function handleReset() {
//     resetGame()
//   }
//   return (
//     <motion.div
//       key="game-completed-modal"
//       initial={{ opacity: 0, y: -1000, scale: 0 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -1000, scale: 0 }}
//       className=" fixed top-0 z-50  w-full h-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl "
//     >
//       <div className=" absolute top-0 w-full">
//         <Header onMenuClick={() => setIsSidebarOpen(true)} />
//       </div>
//       <motion.div
//         initial={{ opacity: 0, y: -500, scale: 0 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         className=" max-w-lg mx-auto bg-white rounded-lg p-6 shadow-lg text-neutral-800 flex flex-col items-center justify-center"
//       >
//         <h2 className="text-2xl font-bold text-center mb-2">
//           Juego Finalizado
//         </h2>
//         <p className=" mb-4">Has completado todas las categorias</p>
//         <Button onClick={handleReset}>Resetear Juego</Button>
//       </motion.div>
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//     </motion.div>
//   )
// }

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
      className="z-0 py-1 text-center font-oswaldRegular text-white mb-0"
      style={{ backgroundColor: colors.primaryLight }}
    >
      Última categoría jugada:{' '}
      <span className=" font-oswaldHeavyItalic text-xl ">
        {selectedCategory.name}
      </span>
    </motion.div>
  )
}
