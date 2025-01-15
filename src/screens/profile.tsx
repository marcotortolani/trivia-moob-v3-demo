import { useState } from 'react'
import useSound from 'use-sound'

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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'

import { XIcon } from 'lucide-react'

import closeSound from '@/assets/sound/popup-close-minimize.mp3'
import blopSound from '@/assets/sound/blop.mp3'
import successAction from '@/assets/sound/success-action.mp3'

export default function Profile() {
  const { colors, soundActive } = useConfigStore()
  const { categoriesState } = useGameStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [playBlop] = useSound(blopSound)

  const answeredQuestionsProgress = categoriesState?.reduce(
    (acc, category) =>
      acc + category.questions.filter((q) => q.completed).length,
    0
  )

  function handleResetButton() {
    if (soundActive) playBlop()
    setIsOpen(true)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative w-full min-h-[100dvh] flex flex-col items-center gap-4 xl:gap-10 overflow-hidden mb-10 md:mb-0 `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className=" flex flex-col items-center gap-4 w-full max-w-screen-sm mx-auto xl:max-w-screen-lg xl:flex-row xl:justify-between  ">
          <div className=" flex flex-col lg:gap-6">
            <UserPoints />
            <CategoriesProgress
              answeredQuestionsProgress={answeredQuestionsProgress}
            />
          </div>
          <div className=" flex flex-col lg:gap-6">
            <AnswersType />
            <TimeSpent answeredQuestionsProgress={answeredQuestionsProgress} />
            <PointsInfo />
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          type="button"
          className="mt-10 text-lg font-oswaldBold tracking-wider uppercase hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
          style={{
            background: `linear-gradient(to bottom, ${colors.primary}, ${colors.primary} 200%)`,
            color: colors.text,
          }}
          onClick={handleResetButton}
        >
          Reset Trivia
        </Button>

        <ResetModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}

const ResetModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { colors, soundActive, user } = useConfigStore()
  const { resetGame } = useGameStore()

  const [playSuccess] = useSound(successAction, {
    volume: 0.5,
    playbackRate: 1.8,
  })
  const [playClose] = useSound(closeSound)

  const handleReset = () => {
    if (soundActive) playSuccess()
    resetGame()

    setTimeout(() => {
      handleClose()
    }, 200)
  }

  const handleClose = () => {
    if (soundActive) playClose()
    onClose()
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose} key="reset-modal">
      <DialogContent
        className="z-[500000] w-[95%] max-w-[500px] min-h-[400px] overflow-x-hidden  overflow-y-scroll md:overflow-hidden px-4 border-none outline-none rounded-xl "
        style={{
          color: '#0000',
          background: `linear-gradient(180deg, ${colors.primary} 50%, rgba(0,0,0,1) 150%)`,
        }}
      >
        <DialogHeader className=" ">
          <DialogClose
            className=" absolute top-4 right-4 p-2 w-10 h-10 "
            style={{ color: colors.text }}
            onClick={handleClose}
          >
            <XIcon className=" w-6 h-6" style={{ color: colors.text }} />
          </DialogClose>
          <DialogTitle
            className=" font-oswaldMedium uppercase"
            style={{ color: colors.text }}
          >
            Reset Trivia
          </DialogTitle>
          <DialogDescription
            style={{ color: 'transparent' }}
          ></DialogDescription>
        </DialogHeader>
        <p
          className=" w-full xs:w-5/6 mx-auto text-center"
          style={{ color: colors.text }}
        >
          {user.userName === '' ? 'Este' : user.userName + ', este'} proceso
          borrará todos los datos de progreso y no podrás recuperarlos.
        </p>
        <p className=" text-center" style={{ color: colors.text }}>
          ¿Deseas continuar con la acción?
        </p>

        <div className=" w-full xs:px-10 flex items-center justify-between">
          <Button
            type="button"
            className="bg-white hover:bg-white/90 font-oswaldBold uppercase"
            style={{ color: colors.primary }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-white hover:bg-white/90 font-oswaldBold uppercase"
            style={{ color: colors.primary }}
            onClick={handleReset}
          >
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
