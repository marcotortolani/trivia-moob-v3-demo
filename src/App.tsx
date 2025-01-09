import { lazy, Suspense } from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { useConfigStore } from './lib/config-store'

const Loading = lazy(() => import('./components/loading'))
const Upcoming = lazy(() => import('./components/game-upcoming'))
const Ended = lazy(() => import('./components/game-ended'))

const Home = lazy(() => import('./screens/home'))
const Questions = lazy(() => import('./screens/questions'))
const Ranking = lazy(() => import('./screens/ranking'))
const Profile = lazy(() => import('./screens/profile'))
const HowToPlay = lazy(() => import('./screens/how-to-play'))
const FAQ = lazy(() => import('./screens/faq'))
const Rewards = lazy(() => import('./screens/rewards'))
//const Terms = lazy(() => import('./screens/terms/terms'))

export function App() {
  const { validPeriod } = useConfigStore()

  const actualDate = new Date().getTime()
  const startDate = new Date(validPeriod.startDate).getTime()
  const endDate = new Date(validPeriod.endDate).getTime()

  if (actualDate < startDate) {
    return <Upcoming />
  }
  if (actualDate > endDate) {
    return <Ended />
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

          {/* <Route path="/terms" element={<Terms />} />
          <Route path="/terms-example" element={<TermsExample />} /> */}
        </Routes>
      </Router>
    </Suspense>
  )
}
