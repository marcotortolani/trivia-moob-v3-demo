import useSound from 'use-sound'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Menu, VolumeX, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import popClick from '../assets/sound/pop-click.mp3'
import swoosh from '../assets/sound/swoosh.mp3'
import arcadePop from '../assets/sound/arcade-pop.mp3'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const { images, colors, soundActive, setSoundActive } = useConfigStore()

  const [playPopClick] = useSound(popClick)
  const [playSwoosh] = useSound(swoosh)
  const [playPop] = useSound(arcadePop)

  const onSoundClick = () => {
    playPopClick()
    setSoundActive(!soundActive)
  }

  const onMenu = () => {
    if (soundActive) playSwoosh()
    onMenuClick()
  }

  function handleLogoClick() {
    if (soundActive) playPop()
    // navigate('/')
    window.document.location.href = '/'
  }

  return (
    <motion.header
      initial={{ y: -200 }}
      animate={{ y: 0, transition: { duration: 0.5 } }}
      className={`${
        location.pathname === '/' && ' z-[50] '
      } z-0 relative w-full`}
    >
      <div className=" w-full max-w-screen-md xl:max-w-screen-lg mx-auto px-2 xs:px-4 my-2 flex justify-between items-center">
        <Button
          variant="ghost"
          size="default"
          onClick={onMenu}
          className=" p-2  focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-150 ease-in-out"
        >
          <Menu style={{ width: 28, height: 32, color: colors.text }} />
        </Button>

        <div onClick={handleLogoClick}>
          <img
            src={images.es.logoHeader}
            alt="Logo"
            className="w-5/6 xs:w-4/5 max-w-[300px] mx-auto"
          />
        </div>

        <motion.button
          initial={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: -60 }}
          type="button"
          className=" p-2 focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-100 ease-in-out"
          onClick={onSoundClick}
        >
          {soundActive ? (
            <Volume2
              style={{
                width: 28,
                height: 32,
                color: colors.text,
              }}
            />
          ) : (
            <VolumeX
              style={{
                width: 28,
                height: 32,
                color: colors.text,
              }}
            />
          )}
        </motion.button>
      </div>
    </motion.header>
  )
}
