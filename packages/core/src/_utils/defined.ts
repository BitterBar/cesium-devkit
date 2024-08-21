export default function defined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null
}
