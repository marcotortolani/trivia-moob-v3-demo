import { motion } from 'framer-motion'

export default function BadgeGlow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className=" px-2 py-1 flex items-center drop-shadow-gold2 bg-gradient-to-r from-yellow-500 via-yellow-100 to-yellow-500 border-2 border-yellow-300 shadow-md shadow-yellow-600/80 text-sm text-black rounded-lg font-bold animate-bounce2"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
