import { useState, useEffect } from 'react'
import useSound from 'use-sound'
import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { AnimateProgressive } from '../animated-number'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'

import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import UserAvatar from './user-avatar'
import { XIcon, Edit, ChevronLeft, ChevronRight } from 'lucide-react'

import closeSound from '@/assets/sound/popup-close-minimize.mp3'
import blopSound from '@/assets/sound/blop.mp3'
import successAction from '@/assets/sound/success-action.mp3'
import FallbackImage from '../fallback-image'

import avatars from '@/data/avatars-images.json'

export default function UserPoints() {
  const { colors, images, user, soundActive, dictionary } = useConfigStore()
  const { score } = useGameStore()
  const [points, setPoints] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const [playBlop] = useSound(blopSound)

  const handleEdit = () => {
    if (soundActive) playBlop()
    setIsOpen(true)
  }

  useEffect(() => {
    setPoints(score)
  }, [score])

  return (
    <motion.section
      initial={{ opacity: 0.5, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-lg px-0 flex items-center justify-between "
    >
      <div className=" w-1/3 flex flex-col items-center justify-center ">
        <button
          type="button"
          onClick={handleEdit}
          className=" relative w-4/6 max-w-[100px] aspect-square  "
        >
          <UserAvatar />

          <Edit
            size={20}
            stroke="#000"
            className="absolute z-30 bottom-0 right-0 -translate-x-1/4 -translate-y-1/4 w-5 h-5 xs:w-6 xs:h-6 p-0.5 xs:p-1 rounded-full"
            style={{ background: '#FFF', color: '#000' }}
          />
        </button>
        <span
          className=" text-sm xs:text-base font-oswaldMedium uppercase tracking-wider "
          style={{ color: colors.text }}
        >
          {user.userName ? user.userName : dictionary['Your Name']}
        </span>
      </div>
      <div className=" ml-1 mr-3 w-[1px] h-16 bg-neutral-400 content-normal"></div>

      <div className=" relative px-2 w-3/5  mx-auto flex flex-col items-center  ">
        <div className=" relative ">
          <FallbackImage
            primaryImage={images.backgroundPointsMenu}
            fallbackImage={images.backgroundPoints}
            alt="background points"
          />
          <span
            className="absolute ml-2 xs:ml-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl xs:text-3xl font-oswaldBold"
            style={{ color: colors.text }}
          >
            <AnimateProgressive value={points} />
          </span>
        </div>
        <span
          className=" text-sm xs:text-base font-oswaldMedium uppercase tracking-wider "
          style={{ color: colors.text }}
        >
          {dictionary['Score']}
        </span>
      </div>
      <UserData isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </motion.section>
  )
}

const UserData = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { colors, soundActive, user, setUserData, dictionary } =
    useConfigStore()
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [formData, setFormData] = useState({
    userName: user.userName,
    userEmail: user.userEmail,
    userAvatar: user.userAvatar,
  })

  const [playBlop] = useSound(blopSound)
  const [playSuccess] = useSound(successAction, {
    volume: 0.5,
    playbackRate: 1.8,
  })

  const updateAvatar = ({ direction }: { direction: 1 | -1 }) => {
    if (direction === -1 && avatarIndex === 0) return
    if (direction === 1 && avatarIndex === avatars.length - 1) return

    const newIndex = avatarIndex + direction

    if (soundActive) playBlop()
    setAvatarIndex(newIndex)
    setFormData({ ...formData, userAvatar: avatars[newIndex] })
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (soundActive) playSuccess()
    e.preventDefault()
    setUserData({
      ...user,
      ...formData,
    })

    setTimeout(() => {
      handleClose()
    }, 200)
  }

  const [playClose] = useSound(closeSound)
  const handleClose = () => {
    if (soundActive) playClose()
    onClose()
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose} key="edit-profile">
      <DialogContent
        className="z-[500000] w-[95%]  min-h-[400px] overflow-x-hidden  overflow-y-scroll md:overflow-hidden px-4 border-none outline-none rounded-xl "
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
            {dictionary['Edit Profile']}
          </DialogTitle>
          <DialogDescription
            style={{ color: 'transparent' }}
          ></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex justify-center items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="default"
              className={` ${
                avatarIndex === 0 && 'scale-0'
              } bg-black/20 hover:bg-black/30 p-2 active:scale-95 transition-all ease-in-out duration-150`}
              onClick={() => updateAvatar({ direction: -1 })}
            >
              <ChevronLeft
                size={20}
                className="w-10 h-10"
                style={{ color: colors.text }}
              />
            </Button>
            <Avatar className="w-24 h-24 text-black">
              <AvatarImage
                src={
                  formData.userAvatar || '/placeholder.svg?height=96&width=96'
                }
              />
              {!formData.userAvatar && (
                <AvatarFallback>
                  {formData.userName?.charAt(0) || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              type="button"
              variant="ghost"
              size="default"
              className={` ${
                avatarIndex === avatars.length - 1 && 'scale-0'
              } bg-black/20 hover:bg-black/30 p-2 active:scale-95 transition-all ease-in-out duration-150`}
              onClick={() => updateAvatar({ direction: 1 })}
            >
              <ChevronRight
                size={20}
                className="w-10 h-10"
                style={{ color: colors.text }}
              />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="userName"
                className="text-white font-poppinsRegular"
              >
                {dictionary['Username']}
              </Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                className="bg-white/10 border-white/20 font-poppinsRegular text-white placeholder:text-white/50"
                placeholder={dictionary['Enter your name']}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="userEmail"
                className="text-white font-poppinsRegular"
              >
                {dictionary['Email']}
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
                className="bg-white/10 border-white/20 font-poppinsRegular text-white placeholder:text-white/50"
                placeholder={dictionary['Mail example']}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="userAvatar"
                className="text-white font-poppinsRegular"
              >
                {dictionary['Avatar URL']}{' '}
                <span className=" text-xs font-poppinsLight">
                  ({dictionary['optional']})
                </span>
              </Label>
              <Input
                id="userAvatar"
                value={
                  formData.userAvatar.includes('http')
                    ? formData.userAvatar
                    : ''
                }
                onChange={(e) =>
                  setFormData({ ...formData, userAvatar: e.target.value })
                }
                className="bg-white/10 border-white/20 font-poppinsRegular text-white placeholder:text-white/50"
                placeholder={dictionary['Avatar URL example']}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-white hover:bg-white/90 font-oswaldBold uppercase"
              style={{ color: colors.primary }}
            >
              {dictionary['Save Changes']}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
