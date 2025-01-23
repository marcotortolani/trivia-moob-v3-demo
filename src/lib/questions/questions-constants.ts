export type MedalType = 'gold' | 'silver' | 'copper' | null
export const MEDAL_THRESHOLDS = {
  gold: {
    percentageGoal: 0.85,
    type: 'gold' as MedalType,
    message: {
      es: '¡Estás más cerca de ganar!',
      en: 'You´re closer to winning!',
      pt: 'Você está mais perto de ganhar!',
    },
  },
  silver: {
    percentageGoal: 0.6,
    type: 'silver' as MedalType,
    message: { es: '¡Sigue así!', en: 'Keep going!', pt: 'Continue assim!' },
  },
  copper: {
    percentageGoal: 0.25,
    type: 'copper' as MedalType,
    message: {
      es: '¡Lleguemos al próximo!',
      en: 'Let ́s go to the next!',
      pt: 'Vamos para o próximo!',
    },
  },
}
