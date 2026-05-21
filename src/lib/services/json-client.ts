import { type Decoder } from '~/lib/utils/predicates'
import { type Result } from '~/lib/utils/result'

export type JsonRequest = {
  url: string | URL
  decoderError?: string
  init?: RequestInit
}

export const requestJson = async <T>(
  request: JsonRequest,
  decoder: Decoder<T>,
): Promise<Result<T>> => {
  try {
    const response = await fetch(request.url, {
      headers: {
        accept: 'application/json',
      },
      ...request.init,
    })

    if (!response.ok) {
      return [
        null,
        new Error(
          `${response.status} ${response.statusText || 'Request failed'}`,
        ),
      ]
    }

    const payload: unknown = await response.json()

    if (!decoder(payload)) {
      return [
        null,
        new Error(request.decoderError ?? 'Response payload was not valid'),
      ]
    }

    return [payload, null]
  } catch (error) {
    return [null, toError(error)]
  }
}

export const createUrl = (
  origin: string,
  path: Array<number | string>,
  search?: Record<string, number | string>,
) => {
  const url = new URL(
    path.map(segment => encodeURIComponent(segment)).join('/'),
    origin,
  )

  Object.entries(search ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  return url
}

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error('Unknown request error')
