import useSound from 'use-sound'

import { useConfigStore } from '@/lib/config-store'
import { Button } from '../ui/button'

import blopSound from '@/assets/sound/blop.mp3'

export default function NoQuestionsAvailable() {
  const { colors, soundActive, dictionary } = useConfigStore()
  const [playButton] = useSound(blopSound)

  return (
    <div className=" w-full mt-6 flex flex-col items-center justify-center gap-4">
      <p
        className=" w-5/6 font-tekoMedium text-3xl xs:text-4xl lg:text-[3.2rem] leading-8 uppercase text-center"
        style={{ color: colors.text }}
      >
        {dictionary['No questions available']}
      </p>
      <Button
        className="px-8 py-6 lg:py-8 font-oswaldMedium text-2xl lg:text-3xl hover:scale-105 active:scale-100 transition-all duration-200 ease-in-out uppercase rounded-full"
        style={{
          background: `linear-gradient(180deg, ${colors.primary} 60%, rgba(0, 0, 0, 1) 150%)`,
          color: colors.text,
        }}
        onClick={() => {
          if (soundActive) {
            playButton()
          }
          window.document.location.href = '/trivia'
        }}
      >
        {dictionary['Spin the wheel']}
      </Button>
    </div>
  )
}
