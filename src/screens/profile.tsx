import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { DonutChart } from '@/components/DonutChart'

import goldenRing from '/img/default/anillo-ruleta.webp'
import correctIcon from '/img/default/correct-icon.webp'
import incorrectIcon from '/img/default/incorrect-icon.webp'
import bonusIcon from '/img/default/bonus-icon.webp'
import TimeSection from '@/components/profile/time-section'

export default function Profile() {
  const { colors, images, user, config } = useConfigStore()
  const { score, categoriesState, totalQuestions, answeredQuestions } =
    useGameStore()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const answeredQuestionsProgress = categoriesState?.reduce(
    (acc, category) =>
      acc + category.questions.filter((q) => q.completed).length,
    0
  )

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative min-h-[100dvh] flex flex-col items-center gap-4 overflow-hidden mb-10 `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* User & Points */}
        <section className="w-full max-w-lg px-0 flex items-center justify-between ">
          <div className=" w-1/3 flex flex-col items-center justify-center ">
            <div className=" relative w-4/6 max-w-[100px] aspect-square">
              <img
                src={goldenRing}
                alt="Ring wheel"
                className=" absolute z-50 w-full h-full p-1   "
              />
              <img
                className="w-full h-full p-2 bg-black/0 backdrop-brightness-150 rounded-full "
                src={images.avatars[0]}
                alt="Image User Avatar"
              />
            </div>
            <span
              className=" font-oswaldMedium uppercase tracking-wider "
              style={{ color: colors.text }}
            >
              {user.userName}
            </span>
          </div>
          <div className=" ml-1 mr-3 w-[1px] h-16 bg-neutral-400 content-normal"></div>

          <div className=" relative px-2 w-3/5  mx-auto flex flex-col items-center  ">
            <div className=" relative ">
              <img src={images.backgroundPointsMenu} alt="background points" />
              <span
                className="absolute ml-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] xs:text-3xl font-oswaldBold"
                style={{ color: colors.text }}
              >
                {score}
              </span>
            </div>
            <span
              className=" font-oswaldMedium uppercase tracking-wider "
              style={{ color: colors.text }}
            >
              Puntaje
            </span>
          </div>
        </section>

        {/* Progress by Category */}
        <section className=" w-full max-w-lg h-fit px-4 my-2">
          <SectionTitle title="Progreso por categoría" />

          <ul className=" w-full my-4 flex flex-col gap-2 ">
            {categoriesState.map((cat) => (
              <li
                key={cat.id}
                className=" w-full flex items-center justify-between"
              >
                <span
                  className=" text-xs font-oswaldBold uppercase "
                  style={{ color: colors?.text }}
                >
                  {cat.name}
                </span>
                <ProgressBar
                  progress={
                    cat.completed
                      ? cat.questions.length
                      : cat.questions.reduce((acc, question) => {
                          return acc + (question.completed ? 1 : 0)
                        }, 0)
                  }
                  total={cat.questions.length}
                />
              </li>
            ))}
          </ul>
          <div className=" w-full m-0 flex justify-between">
            <h5
              className=" text-xs uppercase font-oswaldBold"
              style={{ color: colors?.correct }}
            >
              Progreso Total
            </h5>
            <ProgressBar
              progress={answeredQuestionsProgress}
              total={totalQuestions}
            />
          </div>
        </section>

        {/* Answers Type */}
        <section className=" w-full max-w-lg h-fit px-4 relative flex flex-col items-center justify-center gap-2 ">
          <div
            className="w-full p-2 pb-4 rounded-xl "
            style={{ border: `2px solid ${colors?.primaryLight}` }}
          >
            <div className=" relative w-full h-3/5 p-0 flex items-center justify-center gap-2.5">
              <SectionTitle title="Índice de aciertos" />
              <DonutChart
                answers={answeredQuestions}
                colorCorrect={colors.correct}
                colorWrong={colors.wrong}
              />
            </div>
            <div className=" w-full flex justify-around ">
              <div className=" flex items-center justify-center gap-1">
                <img
                  className=" w-[5vw] min-w-[15px] max-w-[30px] aspect-square"
                  src={correctIcon}
                  alt="Image Correct Icon"
                />
                <span
                  className=" text-xs font-oswaldRegular uppercase "
                  style={{ color: colors?.text }}
                >
                  Correctas: {answeredQuestions.correct}
                </span>
              </div>

              <div className=" flex items-center justify-center gap-1">
                <img
                  className=" w-[5vw] min-w-[15px] max-w-[30px] aspect-square"
                  src={incorrectIcon}
                  alt="Image Correct Icon"
                />
                <span
                  className=" text-xs font-oswaldRegular uppercase "
                  style={{ color: colors?.text }}
                >
                  Incorrectas: {answeredQuestions.incorrect}
                </span>
              </div>

              <div className=" flex items-center justify-center gap-1">
                <img
                  className=" w-[5vw] min-w-[15px] max-w-[30px] aspect-square"
                  src={bonusIcon}
                  alt="Image Correct Icon"
                />
                <span
                  className=" text-xs font-oswaldRegular uppercase "
                  style={{ color: colors?.text }}
                >
                  Bonus: {answeredQuestions.bonus}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Answers Time */}
        <TimeSection answeredQuestionsProgress={answeredQuestionsProgress} />

        {/* Answers Points Info */}
        <section className=" w-full max-w-lg px-4 mb-0 flex items-center justify-between gap-4 ">
          <SectionTitle title="Puntos por respuesta" />
          <div className=" w-fit ml-2 h-full flex flex-col items-center justify-center ">
            <img
              className=" w-[10vw] min-w-[30px] max-w-[50px] aspect-square"
              src={correctIcon}
              alt="Image Correct Icon"
            />
            <span
              className="text-sm font-oswaldMedium"
              style={{ color: colors?.text }}
            >
              {config.pointsCorrect}
            </span>
          </div>
          <div className=" w-fit h-full flex flex-col items-center justify-center ">
            <img
              className=" w-[10vw] min-w-[30px] max-w-[50px] aspect-square"
              src={incorrectIcon}
              alt="Image Incorrect Icon"
            />
            <span
              className="text-sm font-oswaldMedium"
              style={{ color: colors?.text }}
            >
              {config.pointsWrong}
            </span>
          </div>
          <div className=" w-fit h-full flex flex-col items-center justify-center">
            <img
              className=" w-[10vw] min-w-[30px] max-w-[50px] aspect-square"
              src={bonusIcon}
              alt="Image Bonus Icon"
            />
            <span
              className="text-sm font-oswaldMedium"
              style={{ color: colors?.text }}
            >
              {config.pointsCorrect + config.pointsBonus}
            </span>
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

const ProgressBar = ({
  progress,
  total,
}: {
  progress: number
  total: number
}) => {
  const { colors } = useConfigStore()

  return (
    <div className=" relative w-[65%] flex items-center justify-center gap-1">
      <span
        className=" text-xs font-oswaldRegular"
        style={{ color: colors?.text }}
      >
        0
      </span>

      <div
        className=" w-[85%] h-5 p-0.5 rounded-sm "
        style={{ backgroundColor: '#FFF' }}
      >
        <div
          className=" relative h-full flex items-center justify-center rounded-sm"
          style={{
            width: `${(progress / total) * 100}%`,
            backgroundColor: colors?.correct,
          }}
        >
          {(progress / total) * 100 >= 10 ? (
            <span
              className=" text-xs uppercase font-oswaldMedium"
              style={{ color: colors?.text }}
            >
              {progress < total ? progress : 'Completo'}
            </span>
          ) : (
            <span
              className={`${
                progress === 0 ? 'ml-2' : ''
              } text-xs uppercase font-oswaldMedium`}
              style={{ color: '#000' }}
            >
              {progress}
            </span>
          )}
        </div>
      </div>
      <span
        className="text-sm font-oswaldRegular"
        style={{ color: colors?.text }}
      >
        {total}
      </span>
    </div>
  )
}

const SectionTitle = ({ title }: { title: string }) => {
  const { colors } = useConfigStore()
  return (
    <h3
      className=" text-base uppercase font-oswaldBold"
      style={{ color: colors?.text || '#FFF' }}
    >
      {title}
    </h3>
  )
}
