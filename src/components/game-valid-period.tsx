import { useConfigStore } from '@/lib/config-store'

import triviaUpcoming from '/img/default/trivia-proximamente.webp'
import triviaEnded from '/img/default/trivia-finalizada.webp'

export default function ValidPeriod({ type }: { type: 'upcoming' | 'ended' }) {
  const { validPeriod, images, colors, dictionary } = useConfigStore()
  const dateStartStyled = new Date(validPeriod?.startDate).toLocaleDateString(
    'es',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )
  const timeStartStyled = new Date(validPeriod?.startDate).toLocaleTimeString(
    'es',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )
  const dateEndStyled = new Date(validPeriod?.endDate).toLocaleDateString(
    'es',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )
  const timeEndStyled = new Date(validPeriod?.endDate).toLocaleTimeString(
    'es',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  )

  return (
    <div
      className=" w-screen h-[100dvh] overflow-hidden flex flex-col items-center justify-center  "
      style={{
        background: `linear-gradient(to bottom, ${colors?.background}, #000 120%)`,
        color: colors?.text,
      }}
    >
      <img
        className=" w-2/3 max-w-[300px] h-auto "
        src={images?.es.logoHeader}
        alt="Imágen Logo"
      />
      <div className="w-full h-full pb-20 flex flex-col items-center justify-center gap-2">
        <img
          className={` ${
            type === 'upcoming'
              ? 'w-1/2 max-w-[200px] '
              : ' w-2/5 max-w-[200px]'
          } animate-pulse `}
          src={type === 'upcoming' ? triviaUpcoming : triviaEnded}
          alt="Imágen Icono Proximamente"
        />

        {type === 'upcoming' ? (
          <h4
            className=" w-[90%] max-x-[400px] mt-8 text-center font-oswaldHeavyItalic uppercase mb-8 text-3xl animate-pulse"
            style={{ color: colors?.text }}
          >
            {dictionary['You will be able to play']}
            <br />
            <span className=" text-4xl" style={{ color: colors?.correct }}>
              {dictionary['Coming soon']}
            </span>
          </h4>
        ) : (
          <h4
            className=" w-[90%] max-x-[400px] mt-8 text-center font-oswaldHeavyItalic uppercase mb-8 text-3xl animate-pulse"
            style={{ color: colors?.text }}
          >
            {dictionary['The Trivia has']} <br />
            <span className=" text-4xl " style={{ color: colors?.wrong }}>
              {dictionary['Ended']}
            </span>
          </h4>
        )}

        {type === 'upcoming' ? (
          <p
            className="w-4/5 max-w-[350px] font-oswaldLight tracking-wider text-center uppercase"
            style={{ color: colors?.text }}
          >
            {dictionary['The Trivia will be available from']} {dateStartStyled}{' '}
            {dictionary['at']} {timeStartStyled}
            <span className=" lowercase">{dictionary['hrs']}</span>{' '}
            {dictionary['until']} {dateEndStyled} {dictionary['at']}{' '}
            {timeEndStyled}
            <span className=" lowercase">{dictionary['hrs']}</span>
          </p>
        ) : (
          <p
            className="w-4/5 max-w-[350px] font-oswaldLight tracking-wider text-center uppercase"
            style={{ color: colors?.text }}
          >
            {dictionary['On']} {dateEndStyled} {dictionary['at']}{' '}
            {timeEndStyled}
            <span className=" lowercase">{dictionary['hrs']}</span>
          </p>
        )}
      </div>
    </div>
  )
}
