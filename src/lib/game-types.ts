// lib/game-types.ts
export interface Answer {
  text: string
  isCorrect: boolean
}

export interface Question {
  id: number
  text: string
  answers: Answer[]
  bonus?: boolean
}

export interface Category {
  id: number
  name: string
  questions: Question[]
  bonus?: boolean
}

export interface GameConfig {
  countdownSeconds: number
  amountAnswersToChangeCategory: number
  maxQuestions?: number
  difficultyLevel?: 'easy' | 'medium' | 'hard'
}

export type AnswerType = 'correct' | 'incorrect' | 'bonus'
export type PlayingState = 
  | 'ANSWERING' 
  | 'CHANGE_CATEGORY' 
  | 'ENCOURAGING_MESSAGE'
  | 'CAT_FINISHED'