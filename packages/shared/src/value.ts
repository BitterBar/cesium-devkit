export function defaultValue<T>(a: T | undefined | null, b: T): T {
  return defined(a) ? a : b
}

export function defined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null
}
