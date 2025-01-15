import { useEffect } from 'react'
import { useFetch } from './hooks/useFetch'
import { lazy, Suspense } from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { useConfigStore } from './lib/config-store'
import { useGameStore } from './lib/game-store'

const Loading = lazy(() => import('./components/loading'))
const ValidPeriod = lazy(() => import('./components/game-valid-period'))

const Home = lazy(() => import('./screens/home'))
const Questions = lazy(() => import('./screens/questions'))
const Ranking = lazy(() => import('./screens/ranking'))
const Profile = lazy(() => import('./screens/profile'))
const HowToPlay = lazy(() => import('./screens/how-to-play'))
const FAQ = lazy(() => import('./screens/faq'))
const Rewards = lazy(() => import('./screens/rewards'))
//const Terms = lazy(() => import('./screens/terms/terms'))

const configURL =
  'https://raw.githubusercontent.com/marcotortolani/trivia-moob-v3-demo/refs/heads/main/src/data/config.json'

export function App() {
  const { data: configData } = useFetch(configURL)
  const { validPeriod, lastUpdated, updateConfigData, categories } =
    useConfigStore()
  const { syncCategoriesState } = useGameStore()

  const actualDate = new Date().getTime()
  const startDate = new Date(validPeriod.startDate).getTime()
  const endDate = new Date(validPeriod.endDate).getTime()

  useEffect(() => {
    if (!configData || configData?.lastUpdated === lastUpdated) return
    updateConfigData(configData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configData])

  useEffect(() => {
    if (!categories) return
    syncCategoriesState(categories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories])

  if (configData === null) return <Loading />
  if (actualDate < startDate) {
    return <ValidPeriod type="upcoming" />
  }
  if (actualDate > endDate) {
    return <ValidPeriod type="ended" />
  }

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions/" element={<Questions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/rewards" element={<Rewards />} />

          {/* <Route path="/terms" element={<Terms />} /> */}
        </Routes>
      </Router>
    </Suspense>
  )
}
