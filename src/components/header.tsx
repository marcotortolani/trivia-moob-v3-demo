import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Menu, VolumeX, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const { images, colors } = useConfigStore()
  const [isMuted, setIsMuted] = useState(false)

  return (
    <motion.header
      initial={{ y: -200 }}
      animate={{ y: 0, transition: { duration: 0.5 } }}
      className={`${
        location.pathname === '/' && ' z-[100] '
      } z-0 w-full px-4 my-2 flex justify-between items-center`}
    >
      <Button
        variant="ghost"
        size="default"
        onClick={onMenuClick}
        className=" p-2 focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-150 ease-in-out"
      >
        <Menu style={{ width: 28, height: 32, color: colors.text }} />
      </Button>

      <Link to="/">
        <img
          src={images.es.logoHeader}
          alt="Logo"
          className="w-4/5 max-w-[400px] mx-auto"
        />
      </Link>

      <motion.button
        initial={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: -60 }}
        type="button"
        className=" p-1 focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-100 ease-in-out"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX
            style={{
              width: 28,
              height: 32,
              color: colors.text,
            }}
          />
        ) : (
          <Volume2
            style={{
              width: 28,
              height: 32,
              color: colors.text,
            }}
          />
        )}
      </motion.button>
    </motion.header>
  )
}
