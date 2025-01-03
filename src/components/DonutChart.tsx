import { useMemo, useState, useEffect } from 'react'
import * as d3 from 'd3'

const MARGIN = 1

const dataInitial = [
  { name: 'correct', value: 80, color: '' },
  { name: 'incorrect', value: 20, color: '' },
]

export const DonutChart = ({
  answers,
  colorCorrect,
  colorWrong,
  width = 170,
  height = 170,
}: {
  answers: { correct: number; incorrect: number; bonus: number }
  colorCorrect: string
  colorWrong: string
  width?: number
  height?: number
}) => {
  const [data, setData] = useState(dataInitial)

  const valuePercentage = Math.round(
    ((answers.correct + answers.bonus) /
      (answers.correct + answers.incorrect + answers.bonus)) *
      100
  )

  const radius = Math.min(width, height) / 2 - MARGIN

  const pie = useMemo(() => {
    const pieGenerator = d3.pie().value((d: { value: number }) => d.value)
    return pieGenerator(data)
  }, [data])

  const arcs = useMemo(() => {
    const arcPathGenerator = d3.arc()
    return pie.map((p: { startAngle: number; endAngle: number }) =>
      arcPathGenerator({
        innerRadius: 70,
        outerRadius: radius,
        startAngle: p.startAngle,
        endAngle: p.endAngle,
      })
    )
  }, [radius, pie])

  useEffect(() => {
    setData((prevData) =>
      prevData.map((d) => {
        if (d.name === 'correct') {
          return {
            ...d,
            value: answers.correct + answers.bonus,
            color: colorCorrect,
          }
        }
        if (d.name === 'incorrect') {
          return { ...d, value: answers.incorrect, color: colorWrong }
        }
        return d
      })
    )
  }, [answers, colorCorrect, colorWrong])

  return (
    <div
      className=" relative flex justify-center items-center scale-75"
      style={{ width: width / 2, height: height / 2 }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          transform: 'scale(0.5) translateX(0px)',
        }}
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc: string, i: number) => {
            return <path key={i} d={arc} fill={data[i].color} />
          })}
        </g>
      </svg>
      <span className=" relative z-[500] text-white font-oswaldMedium text-2xl">
        {valuePercentage}%
      </span>
    </div>
  )
}
