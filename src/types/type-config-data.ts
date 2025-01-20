export interface ConfigData {
  lastUpdated: string
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
    primaryLight: string
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
    avatars: string[]
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
