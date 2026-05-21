import { type Result } from '~/lib/utils/result'

export type RequestState<T> = {
  data: T | null
  error: string | null
  loading: boolean
  updatedAt: Date | null
}

export type RequestStatus = 'error' | 'idle' | 'loading' | 'ready'

export const createRequestState = <T>(): RequestState<T> => ({
  data: null,
  error: null,
  loading: false,
  updatedAt: null,
})

export const getRequestStatus = <T>(state: RequestState<T>): RequestStatus => {
  if (state.loading) {
    return 'loading'
  }

  if (state.error) {
    return 'error'
  }

  return state.data ? 'ready' : 'idle'
}

export const applyRequestResult = <T>(
  result: Result<T>,
  previous: RequestState<T>,
): RequestState<T> => {
  const [data, error] = result

  if (error) {
    return {
      ...previous,
      error: error instanceof Error ? error.message : 'Unknown request error',
      loading: false,
      updatedAt: new Date(),
    }
  }

  return {
    data,
    error: null,
    loading: false,
    updatedAt: new Date(),
  }
}
