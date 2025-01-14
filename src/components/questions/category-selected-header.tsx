import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'

import goldenRing from '/img/default/anillo-ruleta.webp'

export default function CategorySelectedHeader() {
  const { selectedCategory } = useGameStore()
  const { colors } = useConfigStore()
  return (
    <motion.div
      key="category-selected"
      initial={{ opacity: 0, scale: 0.5, y: 1000 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
          delay: 0,
          type: 'spring',
          stiffness: 40,
        },
      }}
      className=" flex items-center justify-center gap-2 "
    >
      <div className=" relative w-1/6 max-w-[100px] aspect-square">
        <img
          src={goldenRing}
          alt="Ring wheel"
          className=" absolute z-50 w-full h-full p-1  "
        />
        <img
          className="w-full h-full"
          src={selectedCategory?.image}
          alt={selectedCategory?.name}
        />
      </div>
      <span
        className=" font-oswaldBold italic tracking-wider text-lg "
        style={{ color: colors.text }}
      >
        {selectedCategory.name}
      </span>
    </motion.div>
  )
}
