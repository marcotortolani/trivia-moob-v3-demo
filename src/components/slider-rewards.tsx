import { useState } from 'react'
import useSound from 'use-sound'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import fingerSnap from '../assets/sound/finger-snap.mp3'

export default function SliderRewards() {
  const { colors, images, soundActive } = useConfigStore()
  const [[item, direction], setPage] = useState([0, 0])

  const [playSnap] = useSound(fingerSnap)

  const REWARDS_ITEMS = images['es'].rewardsImages.filter(
    (item) => item.src !== 'null' && item.src !== null && item.src !== ''
  )

  const paginate = (newDirection: number) => {
    if (
      item + newDirection >= 0 &&
      item + newDirection < REWARDS_ITEMS.length + 1
    ) {
      if (soundActive) playSnap()
      setPage([item + newDirection, newDirection])
    }
  }

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50 // Minimum distance to trigger a swipe
    if (info.offset.x > swipeThreshold) {
      paginate(-1)
    } else if (
      info.offset.x < -swipeThreshold &&
      item < REWARDS_ITEMS.length - 1
    ) {
      paginate(1)
    }
  }

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        rotateY: direction > 0 ? -45 : 45,
        scale: 0.8,
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        rotateY: direction < 0 ? -45 : 45,
        scale: 0.8,
      }
    },
  }

  return (
    <div className="">
      <div className=" relative w-full h-[60vh] min-h-[350px] max-h-[600px] flex items-center justify-center ">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={item}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              rotateY: { duration: 0.5 },
              scale: { duration: 0.5 },
            }}
            drag={'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full flex flex-col items-center justify-center hover:cursor-grab rounded-xl "
            style={{ perspective: '1000px' }}
          >
            <img
              src={REWARDS_ITEMS[item].src}
              alt={`Image Step ${item + 1}`}
              className="w-full h-auto max-w-[450px] sm:w-auto sm:max-w-full sm:h-full rounded-xl pointer-events-none shadow-md shadow-black/50 "
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        className={`${
          item >= REWARDS_ITEMS.length || REWARDS_ITEMS.length === 1
            ? ' scale-100 hidden2 '
            : ' scale-100'
        } w-full flex items-center justify-between gap-2 transition-all duration-150 ease-in-out`}
      >
        <Button
          onClick={() => paginate(-1)}
          variant="default"
          className={` ${
            item === 0 ? 'pointer-events-none scale-0 ' : ' scale-100 '
          } z-50 p-1 bg-transparent hover:bg-transparent active:scale-90 active:bg-transparent shadow-none flex items-center transition-all duration-150 ease-in-out`}
        >
          <ChevronLeft style={{ color: colors.text, width: 30, height: 30 }} />
        </Button>
        {REWARDS_ITEMS.length > 1 && (
          <PaginationBullets items={REWARDS_ITEMS} item={item} />
        )}
        <Button
          onClick={() => paginate(1)}
          variant="default"
          className={`${
            item === REWARDS_ITEMS.length - 1
              ? 'pointer-events-none scale-0 '
              : ' scale-100 '
          } z-50 p-1 bg-transparent hover:bg-transparent active:scale-90 active:bg-transparent shadow-none flex items-center transition-all duration-150 ease-in-out`}
        >
          <ChevronRight style={{ color: colors.text, width: 30, height: 30 }} />
        </Button>
      </div>
    </div>
  )
}

const PaginationBullets = ({
  items,
  item,
}: {
  items: { src: string }[]
  item: number
}) => {
  const { colors } = useConfigStore()
  return (
    <div className=" flex gap-2 justify-center items-center">
      {items.map((_, index) => (
        <div
          key={index}
          className={` ${
            index === item ? ' scale-100 ' : ' scale-[0.6] '
          } w-4 h-4 rounded-full transition-all duration-200 ease-in-out`}
          style={{
            backgroundColor: index === item ? colors.primary : colors.text,
            border: `1px solid ${colors.text}`,
          }}
        />
      ))}
    </div>
  )
}
