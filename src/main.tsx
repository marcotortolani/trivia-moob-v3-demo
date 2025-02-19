import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import AppRouter from './AppRouter'
import Loading from './components/loading'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <Router basename="/">
      {/* <Router basename="/trivia"></Router> */}
        <AppRouter />
      </Router>
    </Suspense>
  </StrictMode>
)
