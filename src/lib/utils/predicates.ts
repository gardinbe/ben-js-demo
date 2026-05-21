export type Decoder<T> = (value: unknown) => value is T

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isNullableString = (value: unknown): value is string | null =>
  value === null || isString(value)

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

export const isArrayOf =
  <T>(decoder: Decoder<T>) =>
  (value: unknown): value is Array<T> =>
    Array.isArray(value) && value.every(decoder)

export const isPromiseLike = <T>(value: unknown): value is PromiseLike<T> =>
  isRecord(value) && typeof value.then === 'function'
