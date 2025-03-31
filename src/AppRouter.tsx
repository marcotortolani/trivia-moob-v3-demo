import { lazy, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
const Loading = lazy(() => import('./components/loading'))
const App = lazy(() => import('./App'))

export default function AppRouter() {
  const [searchParams] = useSearchParams()
  const gameHash = searchParams.get('gamehash')
  const userHash = searchParams.get('userhash')
  const [created, setCreated] = useState(false)
  const uniqueHash = `${gameHash}-${userHash}`
  const lastUniqueHash = localStorage.getItem('lastUniqueHash')

  useEffect(() => {
    if (gameHash && userHash && uniqueHash !== lastUniqueHash) {
      // crar en local storage un lastGameHash para el juego
      localStorage.setItem('lastUniqueHash', uniqueHash)
      window.document.location.reload()
    }
    if (lastUniqueHash) {
      setCreated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameHash, userHash, lastUniqueHash])

  if (created) {
    return <App />
  } else {
    return <Loading />
  }
}
