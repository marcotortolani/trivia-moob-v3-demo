import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfigData } from '@/types/type-config-data'
import { useConfigStore } from '@/lib/config-store'

import { ENDPOINT_CONFIG } from '@/data/constants'

type Error = { message: string }

type FetchState = {
  data: ConfigData | null
  loading: boolean
  error: Error | null
}

export function useFetch() {
  const [searchParams] = useSearchParams()
  const gameHash = searchParams.get('gamehash')
  const userHash = searchParams.get('userhash')
  let apiURL: string | null = ''

  const { updateDataEndpoint, dataEndpoint } = useConfigStore()
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  })

  if (gameHash && userHash) {
    apiURL = `${ENDPOINT_CONFIG}/${gameHash}/${userHash}`
  } else if (dataEndpoint.gameHash && dataEndpoint.userHash) {
    apiURL = `${ENDPOINT_CONFIG}/${dataEndpoint.gameHash}/${dataEndpoint.userHash}`
  } else {
    apiURL = null
  }

  // useEffect(() => {
  //   if (gameHash) {
  //     // crar en local storage un lastGameHash para el juego
  //     localStorage.setItem('lastGameHash', gameHash)
  //     useConfigStore.getState().initializeStore({ gameHash, userHash: null })
  //   }
  // }, [gameHash])

  // const options = {
  //   method: 'GET',
  //   redirect: 'follow',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // }

  useEffect(() => {
    if (!apiURL) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: { message: 'La URL es inválida o no está definida.' },
      }))
      return
    }

    if (
      (dataEndpoint.gameHash === '' || dataEndpoint.gameHash === null) &&
      (dataEndpoint.userHash === '' || dataEndpoint.userHash === null) &&
      gameHash !== null &&
      userHash !== null
    ) {
      updateDataEndpoint({
        gameHash: gameHash,
        userHash: userHash,
      })
    }
    let isMounted = true // Evita actualizar el estado si el componente se desmonta.

    const fetchData = async () => {
      const options = {}
      try {
        setState({ data: null, loading: true, error: null })

        const response = await fetch(apiURL, options)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as ConfigData

        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: {
              message: (error as Error).message || 'Error al obtener los datos',
            },
          })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiURL])
  return state
}
