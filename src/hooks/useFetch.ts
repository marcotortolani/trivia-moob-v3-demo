import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfigData } from '@/types/type-config-data'
import { useConfigStore } from '@/lib/config-store'

import { ENDPOINT_CONFIG } from '@/data/constants'
//const LOCAL_ENDPOINT_ALE = 'http://127.0.0.1:8000/api/v1/getTrivia'
import configData from '@/data/config.json'

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
  // const apiURL =
  //   gameHash && userHash
  //     ? `${ENDPOINT_CONFIG}/?gameHash=${gameHash}&userHash=${userHash}`
  //     : null
  const apiURL = `${ENDPOINT_CONFIG}`
  //const apiURL_LOCAL = LOCAL_ENDPOINT_ALE + `/${gameHash}` + `/${userHash}`
  //console.log({ gameHash, userHash })

  const { updateDataEndpoint } = useConfigStore()
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  })

  const options = {}

  return { data: configData, loading: false, error: null }

  useEffect(() => {
    if (!apiURL) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: { message: 'La URL es inválida o no está definida.' },
      }))
      return
    }
    updateDataEndpoint({
      gameHash: gameHash,
      userHash: userHash,
    })
    let isMounted = true // Evita actualizar el estado si el componente se desmonta.

    const fetchData = async () => {
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
