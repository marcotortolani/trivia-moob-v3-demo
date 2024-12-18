export type MedalType = 'gold' | 'silver' | 'copper' | null
export const MEDAL_THRESHOLDS = {
  gold: {
    scoreGoal: 10000,
    type: 'gold' as MedalType,
    message: '¡Estás más cerca de ganar!',
  },
  silver: {
    scoreGoal: 5000,
    type: 'silver' as MedalType,
    message: '¡Sigue así!',
  },
  copper: {
    scoreGoal: 1000,
    type: 'copper' as MedalType,
    message: '¡lleguemos al próximo!',
  },
}
