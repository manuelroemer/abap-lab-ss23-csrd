export function uniq<T>(array: Array<T>) {
  return [...new Set(array)];
}

export function safeSwap<T>(items: Array<T>, indexA: number, indexB: number) {
  if (indexA >= 0 && indexB >= 0 && indexA < items.length && indexB < items.length) {
    const temp = items[indexA];
    items[indexA] = items[indexB];
    items[indexB] = temp;
  }

  return items;
}
