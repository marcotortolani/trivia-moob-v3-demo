import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'

export default function LastestSelectedCategory() {
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
      className="z-0 w-full md:w-fit mx-auto md:px-8 py-1 md:py-1.5 text-center font-oswaldRegular mb-0 md:rounded-full"
      style={{ backgroundColor: colors.primaryLight, color: colors.text }}
    >
      Última categoría jugada:{' '}
      <span className=" font-oswaldHeavyItalic text-xl ">
        {selectedCategory.name}
      </span>
    </motion.div>
  )
}
