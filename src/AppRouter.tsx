import { lazy, Suspense } from 'react'
import {  BrowserRouter as Router } from 'react-router-dom'
const Loading = lazy(() => import('./components/loading'))
const App = lazy(() => import('./App'))

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <App />
      </Router>
    </Suspense>
  )
}
