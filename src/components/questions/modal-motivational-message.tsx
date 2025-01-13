import { motion } from 'framer-motion'
import { useLottie } from 'lottie-react'
import { useConfigStore } from '@/lib/config-store'
import { MotivationalMessage } from '@/hooks/useStateMachine'

import confetti from '../../assets/lotties/motivational-correct/confetti.json'
import rocket from '../../assets/lotties/motivational-correct/notificacion-cohete.json'
import fire from '../../assets/lotties/motivational-correct/notificacion-fuego.json'
import star from '../../assets/lotties/motivational-correct/notificacion-estrella.json'
import sunglasses from '../../assets/lotties/motivational-correct/notificacion-emoticon-lentes-sol.json'

import muscle from '../../assets/lotties/motivational-incorrect/notificacion-musculo.json'
import fist from '../../assets/lotties/motivational-incorrect/notificacion-puno.json'
import sadFace from '../../assets/lotties/motivational-incorrect/notificacion-triste.json'
import ungryFace from '../../assets/lotties/motivational-incorrect/enojado.json'
import cryFace from '../../assets/lotties/motivational-incorrect/llorando.json'

const ModalMotivationalMessage = ({
  motivationalMessage,
}: {
  motivationalMessage: MotivationalMessage
}) => {
  const { colors } = useConfigStore()
  let lottie = undefined

  switch (motivationalMessage?.lottieName) {
    case 'confetti':
      lottie = confetti
      break
    case 'rocket':
      lottie = rocket
      break
    case 'fire':
      lottie = fire
      break
    case 'star':
      lottie = star
      break
    case 'sunglasses':
      lottie = sunglasses
      break

    case 'muscle':
      lottie = muscle
      break
    case 'fist':
      lottie = fist
      break
    case 'sadFace':
      lottie = sadFace
      break
    case 'ungryFace':
      lottie = ungryFace
      break
    case 'cryFace':
      lottie = cryFace
      break
  }

  const options = {
    animationData: lottie,
    loop: true,
    autoplay: true,
  }
  const { View } = useLottie(options)

  return (
    <motion.div
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: 500 }}
      className="absolute top-0 left-0 z-[200] w-full min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-black/20 via-black/40 to-black backdrop-blur-sm"
    >
      <div className=" p-6 max-w-md w-full text-center lg:space-y-10 ">
        <h2
          className=" w-fit mx-auto px-4 py-2 mb-4 text-2xl xs:text-3xl font-tekoMedium tracking-wide uppercase rounded-lg"
          style={{
            color: colors.text,
            background: `linear-gradient(180deg, ${colors.primary} 60%, rgba(0, 0, 0, 1) 160%)`,
          }}
        >
          {motivationalMessage?.title}
        </h2>
        {lottie !== undefined && <div className=" w-2/3 mx-auto">{View}</div>}
        <p
          className="mb-6 font-oswaldHeavyItalic uppercase text-3xl xs:text-5xl "
          style={{ color: colors.text }}
        >
          {motivationalMessage?.longMessage}
        </p>
        <div>
          <p
            className=" font-tekoRegular text-2xl xs:text-3xl "
            style={{ color: colors.text }}
          >
            Llevas {motivationalMessage?.number}{' '}
            {motivationalMessage?.type === 'correct'
              ? 'correctas'
              : 'incorrectas'}{' '}
            consecutivas.
          </p>
          <p
            className=" font-tekoMedium uppercase text-2xl xs:text-3xl "
            style={{ color: 'rgb(10, 255, 10)' }}
          >
            {motivationalMessage?.shortMessage}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ModalMotivationalMessage
