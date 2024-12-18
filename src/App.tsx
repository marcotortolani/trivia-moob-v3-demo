import { lazy, Suspense } from 'react'

import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

// import Upcoming from './components/Upcoming'
// import Ended from './components/Ended'
const Loading = lazy(() => import('./components/loading'))

const Home = lazy(() => import('./screens/home'))
const Questions = lazy(() => import('./screens/questions'))
const Ranking = lazy(() => import('./screens/ranking'))
const Profile = lazy(() => import('./screens/profile'))
const Terms = lazy(() => import('./screens/terms'))
const Tutorial = lazy(() => import('./screens/tutorial'))
const About = lazy(() => import('./screens/about'))
const Rewards = lazy(() => import('./screens/rewards'))

export function App() {
  //tomar datos desde el store
  //  const { selectedCategory } = useGameStore()

  //  const { validPeriod } = useContext(ConfigContext) --> store
  //const actualDate = new Date().getTime()
  // const startDate = new Date(validPeriod.startDate).getTime()
  // const endDate = new Date(validPeriod.endDate).getTime()

  // if (actualDate < startDate) {
  //   return <Upcoming />
  // }

  // if (actualDate > endDate) {
  //   return <Ended />
  // }

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions/" element={<Questions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </Router>
    </Suspense>
  )
}
