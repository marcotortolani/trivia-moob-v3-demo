export interface ConfigData {
  lastUpdated: string
  userData: {
    userId: string
    userName: string
    userMSISDN: string
    userEmail: string
    userPoints: string
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
  URLImagesHost: string
  colors: {
    background: string
    backgroundCongrats: string
    backgroundRewards: string
    disable: string
    wrong: string
    correct: string
    title: string
    text: string
    text2: string
    primary: string
    secondary: string
    rouletteSection: string[]
    wheel: string
    nextBtnGradient: string
    answerBtnGradient: string
  }
  images: {
    es: {
      logoHeader: string
      rewardsImages: { src: string; name: string }[]
    }
    madeBy: string
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
  textsByLang: {
    es: LanguageTexts
    en: LanguageTexts
    pt: LanguageTexts
  }
  categories: Category[]
}

type LanguageTexts = {
  terms: string
  rewards: string
  categoryTitle: string
  buttonStart: string
  dailyLimit: string
  categoryCompleted: string
  congratsTriviaCompleted: string
  correctAnswer: string
  wrongAnswer: string
  points: string
  userMenu: string
  progressByCategory: string
  totalProgress: string
  hitRate: string
  correctAmount: string
  wrongAmount: string
  bonusAmount: string
  pointsPerAnswer: string
  timeSpentTitle: string
  totalTime: string
  averageTime: string
  seconds: string
}

export type Question = {
  id: number
  title: string
  bonus?: boolean
  answers: { text: string; isCorrect: boolean }[]
}
export type Category = {
  id: number
  name: string
  imgURL: string
  bonus: boolean
  questions: Question[]
}
