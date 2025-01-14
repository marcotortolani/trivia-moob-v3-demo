import { motion } from 'framer-motion'
import useSound from 'use-sound'
import { Link } from 'react-router-dom'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import SliderRewards from '../slider-rewards'

import blopSound from '@/assets/sound/blop.mp3'
import closeSound from '@/assets/sound/popup-close-minimize.mp3'

export function Footer() {
  const { score } = useGameStore()
  const { colors, images, links, soundActive } = useConfigStore()

  const [playBlop, { stop: stopBlop }] = useSound(blopSound, {
    interrupt: true,
    playbackRate: 1,
  })
  const [playClose] = useSound(closeSound)

  const onOpen = () => {
    if (soundActive) playBlop()
  }

  const onClose = () => {
    stopBlop()
    if (soundActive) playClose()
  }

  return (
    <motion.footer
      initial={{ y: 200 }}
      animate={{ y: -5, transition: { duration: 0.5 } }}
      className="z-20 px-4 py-2 lg:pt-4 lg:pb-6"
    >
      <div className=" max-w-screen-md xl:max-w-screen-lg mx-auto xl:px-6 flex justify-between items-end gap-4 ">
        <Link to={links.termsURL} target="_blank">
          <Button
            variant="ghost"
            className=" w-10 xs:w-16 h-fit p-0 flex flex-col items-center uppercase font-oswaldBold text-xs xs:text-sm focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-150 ease-in-out"
            style={{ color: colors.text }}
            onClick={onOpen}
          >
            <img
              src={images.termsButton}
              alt="Logo"
              className=" w-full h-auto"
            />
            Bases
          </Button>
        </Link>

        <div className="relative w-4/6 flex flex-col items-center text-center bg-red-500/0">
          <div
            className="w-full max-w-[200px] md:max-w-[250px] aspect-[600/246] flex items-end justify-center  mb-0.5 xs:mb-1"
            style={{
              backgroundImage: `url(${images.backgroundPoints})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span
              className=" w-full h-full font-oswaldMedium flex items-center justify-center text-center text-2xl xs:text-3xl md:text-4xl pt-2 xs:pt-3 "
              style={{ color: colors.text }}
            >
              {score}
            </span>
          </div>
          <div
            className=" font-oswaldMedium tracking-widest text-xs xs:text-base "
            style={{ color: colors.text }}
          >
            PUNTAJE
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild className=" p-0">
            <Button
              variant="ghost"
              className=" w-10 xs:w-16 h-fit p-0 flex flex-col items-center uppercase font-oswaldBold text-xs xs:text-sm focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-150 ease-in-out"
              style={{ color: colors.text }}
              onClick={onOpen}
            >
              <img
                src={images.rewardsButton}
                alt="Logo"
                className=" w-full h-auto"
              />
              Premios
            </Button>
          </DialogTrigger>
          <DialogContent
            aria-describedby="content"
            aria-description="content"
            className="z-[500000] w-[95%]  min-h-[400px] overflow-x-hidden  overflow-y-scroll md:max-w-[800px] md:overflow-hidden px-4 border-none outline-none rounded-xl "
            style={{
              color: '#0000',
              background: `linear-gradient(180deg, ${colors.primary} 50%, rgba(0,0,0,1) 150%)`,
            }}
          >
            <DialogHeader className=" ">
              <DialogClose
                className=" absolute top-4 right-4 p-2 w-10 h-10 "
                style={{ color: colors.text }}
                onClick={onClose}
              >
                <XIcon className=" w-6 h-6" style={{ color: colors.text }} />
              </DialogClose>
              <DialogTitle
                className=" font-oswaldMedium uppercase"
                style={{ color: colors.text }}
              >
                Premios Disponibles
              </DialogTitle>
              <DialogDescription
                style={{ color: 'transparent' }}
              ></DialogDescription>
            </DialogHeader>

            <SliderRewards />
          </DialogContent>
        </Dialog>
      </div>
    </motion.footer>
  )
}
