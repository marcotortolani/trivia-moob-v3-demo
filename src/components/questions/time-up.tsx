import { motion } from 'framer-motion'
import { useLottie } from 'lottie-react'

import timesUpDynamite from '../../assets/lotties/times-up-dynamite.json'

export default function TimeUp({ timeUp }: { timeUp: boolean }) {
  const options = {
    animationData: timesUpDynamite,
    loop: true,
    autoplay: true,
  }
  const { View } = useLottie(options)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 200 }}
      animate={
        timeUp
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0, y: 200 }
      }
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, scale: 0, y: 200 }}
      className="z-[200] absolute bottom-0 left-0 w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-black/30 to-black/80 backdrop-blur-sm"
    >
      <p className="px-6 py-4 bg-white text-red-600 font-oswaldHeavyItalic uppercase text-xl xs:text-2xl text-center rounded-xl">
        Se agotó el tiempo!!!
      </p>
      <div className=" w-3/5 max-w-[250px] rotate-3 ">{View}</div>
    </motion.div>
  )
}
