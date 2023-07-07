export function swap<T>(items: T, indexA: number, indexB: number) {
  const temp = items[indexA];
  items[indexA] = items[indexB];
  items[indexB] = temp;
  return items;
}
