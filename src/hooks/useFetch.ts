import { useState, useEffect } from 'react'
import { ConfigData } from '@/types/type-config-data'

type Error = { message: string }

type FetchState = {
  data: ConfigData | null
  loading: boolean
  error: Error | null
}

export function useFetch(url: string) {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  })

  const options = {}

  useEffect(() => {
    let isMounted = true // Evita actualizar el estado si el componente se desmonta.

    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null })

        const response = await fetch(url, options)

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
  }, [url])
  return state
}
