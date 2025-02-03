export interface ConfigData {
  lastUpdated: string
  lang: 'es' | 'en' | 'pt'
  userData: {
    userId: string
    userName: string
    userMSISDN: string
    userEmail: string
    userPoints: number
    userAvatar: string
  }
  validPeriod: {
    startDate: string
    endDate: string
  }
  config: {
    triesAllowedPerDay: number
    countdownSeconds: number
    amountAnswersToChangeCategory: number
    pointsCorrect: number
    pointsWrong: number
    pointsBonus: number
  }
  colors: {
    background: string
    backgroundCardQuestion: string
    wrong: string
    correct: string
    title: string
    text: string
    primary: string
    primaryLight: string
    secondary: string
    rouletteSection: string[]
    nextBtnGradient: string
    answerBtnGradient: string
  }
  images: {
    es: {
      logoHeader: string
      rewardsImages: { src: string; name: string }[]
    }
    madeBy: string
    backgroundApp: string
    spinButton: string
    rewardsButton: string
    termsButton: string
    backgroundPoints: string
    backgroundPointsMenu: string
    rouletteSpinAgain: string
    circleQuestionsCounter: string
  }
  links: {
    termsURL: string
  }
  categories: Category[]
}

export type Answer = {
  text: string
  isCorrect: boolean
}

export type Question = {
  id: number
  title: string
  bonus?: boolean
  answers: Answer[]
}
export type Category = {
  id: number
  name: string
  imgURL: string
  bonus: boolean
  questions: Question[]
}

export type Dictionary = {
  [key: string]: string
}

export type Dictionaries = {
  [key: string]: Dictionary
}
