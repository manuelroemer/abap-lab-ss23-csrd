export function uniq<T>(array: Array<T>) {
  return [...new Set(array)];
}
