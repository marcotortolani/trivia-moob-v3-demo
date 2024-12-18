export interface Answer {
  text: string
  isCorrect: boolean
}

export interface Question {
  id: number
  title: string
  bonus: boolean
  answers: Answer[]
}
export interface Category {
  id: number
  name: string
  questions: Question[]
  bonus?: boolean
}
