import defined from './defined'

export default function defaultValue<T>(a: T | undefined | null, b: T): T {
  return defined(a) ? a : b
}
