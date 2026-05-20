export type Result<T, E extends Error = Error> = [null, E] | [T, null]
