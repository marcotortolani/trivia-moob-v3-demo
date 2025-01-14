import { motion } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import SectionTitle from './section-title'

export default function TimeSpent({
  answeredQuestionsProgress,
}: {
  answeredQuestionsProgress: number
}) {
  const { colors, textsByLang } = useConfigStore()
  const { timeSpent } = useGameStore()
  const texts = textsByLang['es']

  function timeToText(time: number) {
    if (time === 0) return '00m:00s'
    if (isNaN(time)) return '00m:00s'

    if (time < 60) return `${time.toString().padStart(2, '0')}s`

    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    return `${minutes.toString().padStart(2, '0')}m ${seconds
      .toString()
      .padStart(2, '0')}s`
  }

  function averageTime(timeSpent: number, totalProgress: number) {
    if (timeSpent === 0 || totalProgress === 0) return 0
    if ((timeSpent / totalProgress) % 2 === 0)
      return (timeSpent / totalProgress).toFixed(1)
    return (timeSpent / totalProgress).toFixed(2)
  }

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
      className=" w-full max-w-lg h-fit p-4 relative flex flex-col items-start justify-center gap-2"
    >
      <SectionTitle title={texts.timeSpentTitle} />

      <div className=" w-full h-full flex items-center gap-2">
        <svg
          fill="#000000"
          viewBox="0 0 24 24"
          id="timer-5-second"
          className=" w-5 h-5"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <polyline
              id="secondary"
              points="12 10 12 14 13.4 15.57"
              style={{
                stroke: colors?.primaryLight,
                fill: 'none',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            ></polyline>
            <path
              id="secondary-2"
              data-name="secondary"
              d="M17.3,8.2l1.5-1.5M6.7,8.2,5.2,6.7M12,6V3M9,3h6"
              style={{
                stroke: colors?.primaryLight,
                fill: 'none',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            ></path>
            <circle
              id="primary"
              cx="12"
              cy="13.5"
              r="7.5"
              style={{
                stroke: colors?.primaryLight,
                fill: 'none',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            ></circle>
          </g>
        </svg>
        <h5
          className=" text-sm xs:text-base font-oswaldRegular tracking-wider uppercase"
          style={{ color: colors?.text }}
        >
          {texts?.totalTime}:
        </h5>
        <p
          className=" text-base font-oswaldRegular align-text-bottom"
          style={{ color: colors?.text }}
        >
          <span className=" text-lg font-oswaldMedium ">{timeSpent}</span>{' '}
          {texts?.seconds} = {timeToText(timeSpent)}
        </p>
      </div>

      <div className=" w-full h-full flex items-center gap-2">
        <svg
          fill="#000000"
          viewBox="0 0 24 24"
          id="timer-5-second"
          className=" w-5 h-5"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <polyline
              id="secondary"
              points="12 10 12 14 13.4 15.57"
              style={{
                stroke: colors?.primaryLight,
                fill: 'none',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            ></polyline>
            <path
              id="secondary-2"
              data-name="secondary"
              d="M17.3,8.2l1.5-1.5M6.7,8.2,5.2,6.7M12,6V3M9,3h6"
              style={{
                stroke: colors?.primaryLight,
                fill: 'none',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            ></path>
            <circle
              id="primary"
              cx="12"
              cy="13.5"
              r="7.5"
              style={{
                stroke: colors?.primaryLight,
                fill: 'none',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            ></circle>
          </g>
        </svg>
        <h5
          className=" text-sm xs:text-base font-oswaldRegular text-wrap tracking-wider uppercase "
          style={{ color: colors?.text }}
        >
          {texts?.averageTime}:
        </h5>
        <p
          className=" min-w-fit text-nowrap text-sm xs:text-base font-oswaldRegular align-text-bottom "
          style={{ color: colors?.text }}
        >
          <span className=" text-lg font-oswaldMedium ">
            {averageTime(timeSpent, answeredQuestionsProgress)}
          </span>{' '}
          {texts?.seconds}
        </p>
      </div>
    </motion.section>
  )
}
