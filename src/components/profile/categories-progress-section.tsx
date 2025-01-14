import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'

import SectionTitle from './section-title'

export default function CategoriesProgress({
  answeredQuestionsProgress,
}: {
  answeredQuestionsProgress: number
}) {
  const { colors } = useConfigStore()
  const { categoriesState } = useGameStore()

  const totalQuestions = categoriesState.reduce(
    (acc, category) => acc + category.questions.length,
    0
  )

  return (
    <motion.section
      initial={{ opacity: 0, x: -500 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.25,
          delay: 0,
          ease: 'easeInOut',
          type: 'spring',
          stiffness: 120,
          damping: 20,
        },
      }}
      className=" w-full max-w-lg h-fit px-4 my-2"
    >
      <SectionTitle title="Progreso por categoría" />

      <ul className=" w-full my-4 flex flex-col gap-2 ">
        {categoriesState.map((cat) => (
          <li
            key={cat.id}
            className=" w-full flex items-center justify-between"
          >
            <span
              className=" text-[0.65rem] xs:text-xs font-oswaldRegular xs:font-oswaldBold uppercase "
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
          className=" text-[0.65rem] xs:text-xs font-oswaldRegular xs:font-oswaldBold uppercase "
          style={{ color: colors?.correct }}
        >
          Progreso Total
        </h5>
        <ProgressBar
          progress={answeredQuestionsProgress}
          total={totalQuestions}
        />
      </div>
    </motion.section>
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
        <motion.div
          initial={{ width: '0%' }}
          animate={{
            width: `${(progress / total) * 100}%`,
            transition: { duration: 0.5, ease: 'easeInOut', delay: 0.3 },
          }}
          className=" relative h-full flex items-center justify-center rounded-sm"
          style={{
            backgroundColor: colors?.correct,
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.55, delay: 0.25 },
            }}
            className={` ${
              (progress / total) * 100 >= 10 ? '' : 'ml-2'
            } text-xs uppercase font-oswaldMedium`}
            style={{
              color: (progress / total) * 100 >= 10 ? colors?.text : '#000',
            }}
          >
            {(progress / total) * 100 >= 10
              ? progress < total
                ? progress
                : 'Completo'
              : progress}
          </motion.span>
        </motion.div>
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
