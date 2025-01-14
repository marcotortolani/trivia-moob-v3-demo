import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import configData from '@/data/config.json'

const {
  userData,
  validPeriod,
  config,
  colors,
  images,

  links,
  textsByLang,
  categories,
} = configData

export type UserData = typeof userData

const categoriesImages = categories.map((category) => ({
  id: category.id,
  name: category.name,
  image: category.imgURL,
}))

interface ConfigState {
  user: UserData
  validPeriod: typeof validPeriod
  config: typeof config
  colors: typeof colors
  images: typeof images
  // sounds: typeof sounds
  links: typeof links
  textsByLang: typeof textsByLang
  categories: typeof categories
  categoriesImages: typeof categoriesImages

  soundActive: boolean
  setSoundActive: (active: boolean) => void
  setUserData: (user: UserData) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      user: userData,
      validPeriod,
      config,
      colors,
      images,
      // sounds,
      links,
      textsByLang,
      categories,
      categoriesImages,
      soundActive: false,
      setSoundActive: (active) => set({ soundActive: active }),
      setUserData: (user) => set({ user }),
    }),
    {
      name: 'config-sound-storage',
      partialize: (state) => ({
        user: state.user,
        soundActive: state.soundActive,
      }),
    }
  )
)
