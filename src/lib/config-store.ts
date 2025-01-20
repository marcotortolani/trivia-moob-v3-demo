import { create } from 'zustand'
import { persist } from 'zustand/middleware'
//import configData from '@/data/config.json'
import configDataInitial from '@/data/configDataInitial.json'
import { ConfigData } from '@/types/type-config-data'

const {
  lastUpdated,
  userData,
  validPeriod,
  config,
  colors,
  images,
  links,
  textsByLang,
  categories,
} = configDataInitial

export type UserData = ConfigData['userData']
type CategoryImage = {
  id: number
  name: string
  image: string
}

const categoriesImages: CategoryImage[] = categories.map((category) => ({
  id: category.id,
  name: category.name,
  image: category.imgURL,
}))

interface ConfigState {
  lastUpdated: string
  user: UserData
  validPeriod: ConfigData['validPeriod']
  config: ConfigData['config']
  colors: ConfigData['colors']
  images: ConfigData['images']
  links: ConfigData['links']
  textsByLang: ConfigData['textsByLang']
  categories: ConfigData['categories']
  categoriesImages: CategoryImage[]
  soundActive: boolean
  dataEndpoint: { gameHash: string | null; userHash: string | null }
  setUserData: (user: UserData) => void
  updateConfigData: (data: Partial<ConfigData>) => void
  setSoundActive: (active: boolean) => void
  updateDataEndpoint: (data: {
    gameHash: string | null
    userHash: string | null
  }) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      lastUpdated,
      user: userData,
      validPeriod,
      config,
      colors,
      images,
      links,
      textsByLang,
      categories,
      categoriesImages,
      soundActive: false,
      dataEndpoint: { gameHash: '', userHash: '' },
      updateConfigData: (data) => set(data),
      setSoundActive: (active) => set({ soundActive: active }),
      setUserData: (user) => set({ user }),
      updateDataEndpoint: (data) => set({ dataEndpoint: data }),
    }),
    {
      name: 'config-data-trivia-v3',
    }
  )
)
