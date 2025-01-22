import { useEffect } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
export default function Loading() {
  const { colors } = useConfigStore()
  return (
    <div
      className="w-screen h-[100dvh] flex items-center justify-center"
      style={{
        background: `linear-gradient(180deg, ${colors?.background} 0%, #000 150%)`,
      }}
    >
      <div className=" w-full h-full flex items-center justify-center">
        <TextSpinnerLoader colorText={colors.text} />
      </div>
    </div>
  )
}

function TextSpinnerLoader({ colorText }: { colorText: string }) {
  const currentYear = new Date().getFullYear()
  const text = `MEDIA MOOB - TRIVIA - ${currentYear} - `
  const characters = text.split('')

  const radius = 80
  const fontSize = '18px'
  const letterSpacing = 12.5

  const [scope, animate] = useAnimate()

  useEffect(() => {
    const animateLoader = async () => {
      const letterAnimation: [
        string,
        { opacity: number },
        { duration: number; at: string }
      ][] = []
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 0 },
          { duration: 0.3, at: i === 0 ? '+0.8' : '-0.28' },
        ])
      })
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 1 },
          { duration: 0.3, at: i === 0 ? '+0.8' : '-0.28' },
        ])
      })
      animate(letterAnimation, {
        repeat: Infinity,
      })
      animate(
        scope.current,
        { rotate: 360 },
        { duration: 4, ease: 'linear', repeat: Infinity }
      )
    }
    animateLoader()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      ref={scope}
      className=" relative aspect-[1/1]"
      style={{ width: radius * 2 }}
    >
      <p aria-label={text} />
      <p aria-hidden="true" className="text">
        {characters.map((ch, i) => (
          <motion.span
            key={i}
            className={` absolute top-0 left-1/2 font-tekoRegular tracking-wider letter-${i}`}
            style={{
              color: colorText,
              transformOrigin: `0 ${radius}px`,
              transform: `rotate(${i * letterSpacing}deg)`,
              fontSize,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </motion.div>
  )
}
