export type MedalType = 'gold' | 'silver' | 'copper' | null
export const MEDAL_THRESHOLDS = {
  gold: {
    percentageGoal: 0.75,
    type: 'gold' as MedalType,
    message: '¡Estás más cerca de ganar!',
  },
  silver: {
    percentageGoal: 0.5,
    type: 'silver' as MedalType,
    message: '¡Sigue así!',
  },
  copper: {
    percentageGoal: 0.25,
    type: 'copper' as MedalType,
    message: '¡lleguemos al próximo!',
  },
}
