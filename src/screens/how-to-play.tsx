import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useLottie } from 'lottie-react'
import { useConfigStore } from '@/lib/config-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import imageStep01 from '/img/default/seccion-como-jugar/grafico1.webp'
import imageStep02 from '/img/default/seccion-como-jugar/grafico2.webp'
import imageStep03 from '/img/default/seccion-como-jugar/grafico3.webp'
import imageStep04 from '/img/default/seccion-como-jugar/grafico4.webp'
import imageStep05 from '/img/default/seccion-como-jugar/grafico5.webp'

import lottieGlasses from '../../src/assets/lotties/motivational-correct/notificacion-emoticon-lentes-sol.json'

import iconTitle from '/img/default/seccion-como-jugar/icono-titulo.webp'

export default function HowToPlay() {
  const { colors, config } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [[page, direction], setPage] = useState([0, 0])
  const navigate = useNavigate()

  const optionsLottie = {
    animationData: lottieGlasses,
    loop: true,
    autoplay: true,
  }
  const { View } = useLottie(optionsLottie)

  const STEPS = [
    {
      image: imageStep01,
      description: (
        <>
          <span className="font-poppinsBold">Presiona el spinner</span> y haz
          girar la ruleta
        </>
      ),
    },
    {
      image: imageStep02,
      description: (
        <>
          Cuando la ruleta se detenga podrás ver sobre qué categoría contestarás
          la ronda de preguntas
        </>
      ),
    },
    {
      image: imageStep03,
      description: (
        <>
          Pulsa{' '}
          <span className="font-poppinsBold">
            COMENZAR para empezar a contestar
          </span>
          . Si prefieres contestar sobre otra categoría,{' '}
          <span className="font-poppinsBold">
            puedes volver a tirar la ruleta
          </span>{' '}
          con el botón que está debajo a la izquierda del puntaje.
        </>
      ),
    },
    {
      image: imageStep04,
      description: (
        <>
          Se mostrará la pregunta con{' '}
          <span className="font-poppinsBold">
            3 opciones de respuesta, una de ellas es correcta
          </span>
          . Si seleccionas la correcta recibirás <b>{config.pointsCorrect}</b>{' '}
          puntos; de no ser así, recibirás <b>{config.pointsWrong}</b> puntos.
        </>
      ),
    },
    {
      image: imageStep05,
      description: (
        <>
          <span className="font-poppinsBold">El tiempo también cuenta!</span>{' '}
          Cuando más rápido contestes más puntos obtendrás. Si tardas más de 10
          segundos en contestar, la pregunta se considerará incorrecta.
        </>
      ),
    },
  ]

  const paginate = (newDirection: number) => {
    if (page + newDirection >= 0 && page + newDirection < STEPS.length + 1) {
      setPage([page + newDirection, newDirection])
    }
  }

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50 // Minimum distance to trigger a swipe
    if (info.offset.x > swipeThreshold) {
      paginate(-1)
    } else if (info.offset.x < -swipeThreshold) {
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
    <AnimatePresence mode="wait">
      <motion.main
        key="how-to-play-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative w-full min-h-[100dvh] flex flex-col overflow-x-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <section className=" w-full max-w-2xl mx-auto pb-10 px-4 h-full flex flex-col items-center gap-3  ">
          <div className=" flex items-center justify-center gap-2">
            <img src={iconTitle} alt="Icon title" className=" w-10 h-10" />
            <h2
              className=" w-full text-2xl font-oswaldBold uppercase text-left pb-2"
              style={{
                color: colors.text,
              }}
            >
              ¿Cómo Jugar?
            </h2>
          </div>

          <div
            className={`${
              page >= STEPS.length ? ' scale-0 hidden ' : ' scale-100'
            } w-full flex items-center justify-between gap-2 transition-all duration-150 ease-in-out`}
          >
            <Button
              onClick={() => paginate(-1)}
              variant="default"
              className={` ${
                page === 0 ? 'pointer-events-none scale-0 ' : ' scale-100 '
              } z-50 p-1 bg-transparent hover:bg-transparent active:scale-90 active:bg-transparent shadow-none flex items-center transition-all duration-150 ease-in-out`}
            >
              <ChevronLeft
                style={{ color: colors.text, width: 30, height: 30 }}
              />
            </Button>
            <span
              className=" w-16 aspect-square flex items-center justify-center text-4xl font-oswaldHeavyItalic rounded-full"
              style={{
                color: colors.text,
                backgroundColor: colors.primary,
              }}
            >
              {page + 1}º
            </span>
            <Button
              onClick={() => paginate(1)}
              variant="default"
              className={` z-50 p-1 bg-transparent hover:bg-transparent active:scale-90 active:bg-transparent shadow-none flex items-center transition-all duration-150 ease-in-out`}
            >
              <ChevronRight
                style={{ color: colors.text, width: 30, height: 30 }}
              />
            </Button>
          </div>
          <div className=" relative w-full h-full ">
            <AnimatePresence initial={false} custom={direction}>
              {page <= STEPS.length - 1 && (
                <motion.div
                  key={page}
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
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  className="absolute w-full max-w-2xl h-5/6 px-4 min-h-fit flex flex-col items-center justify-center hover:cursor-grab "
                  style={{ perspective: '1000px' }}
                >
                  <img
                    src={STEPS[page].image}
                    alt={`Image Step ${page + 1}`}
                    className="w-full max-w-[600px] mb-4 rounded-lg pointer-events-none "
                  />
                  <p
                    className=" mt-2 text-center font-poppinsLight"
                    style={{ color: colors.text }}
                  >
                    {STEPS[page].description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key={'lottie'}
              initial={{ opacity: 0, y: 1000, scale: 0 }}
              animate={page >= STEPS.length && { opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 1000, scale: 0 }}
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                rotateY: { duration: 0.5 },
                scale: { duration: 0.5 },
              }}
              className="absolute w-full max-w-2xl h-5/6 px-4 min-h-fit flex flex-col items-center justify-center hover:cursor-grab "
              style={{ perspective: '1000px' }}
            >
              <div className=" w-2/3 mx-auto aspect-square">{View}</div>
              <h4
                className=" uppercase text-5xl font-oswaldHeavyItalic"
                style={{ color: colors.text }}
              >
                Ahora Si!
              </h4>
              <p
                className=" mt-2 text-2xl text-center font-oswaldMedium uppercase"
                style={{ color: colors.text }}
              >
                Ya estas listo para empezar a contestar y sumar! <br />
                Buena Suerte!
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/')}
                className=" z-50 mt-4 px-8 py-2 h-fit text-3xl font-poppinsBold uppercase rounded-full flex items-center cursor-pointer transition-all duration-150 ease-in-out"
                style={{
                  background: `linear-gradient(to bottom, ${colors.primary} 60%, #000 150%)`,
                  color: colors.text,
                }}
              >
                ¡Jugar Ahora!
              </Button>
            </motion.div>
          </div>
        </section>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
