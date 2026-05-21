import { isPromiseLike } from '~/lib/utils/predicates'

export type ErrorResult<E = unknown> = [null, E]

export type Result<T = unknown, E = unknown> = ErrorResult<E> | SuccessResult<T>

export type SuccessResult<T = unknown> = [T, null]

export type Unwrapped<T> = T extends Result<infer U, never> ? U : never

export const unwrap: {
  <T>(result: Result<T>): T
  <T>(result: PromiseLike<Result<T>>): Promise<T>
} = result => {
  if (isPromiseLike(result)) {
    return result.then(unwrap)
  }

  const [data, error] = result

  if (error) {
    throw error
  }

  return data!
}

export const unwrapAll: {
  <T extends Array<Result>>(
    ...results: Array<T>
  ): { [K in keyof T]: Unwrapped<T[K]> }
  <T extends PromiseLike<Array<Result>>, U extends Awaited<T>>(
    results: T,
  ): Promise<{ [K in keyof U]: Unwrapped<U[K]> }>
} = (results: Array<PromiseLike<Result>> | Array<Result>): any => {
  if (isPromiseLike(results)) {
    return results.then(unwrapAll)
  }

  return results.map(unwrap)
}
