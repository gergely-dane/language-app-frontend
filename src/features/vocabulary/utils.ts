export const setWithEvictOldest = <K, V>(
  map: Map<K, V>,
  key: K,
  value: V,
  maxEntries: number,
  onEvict?: (evicted: V) => void,
) => {
  map.delete(key);

  while (map.size >= maxEntries) {
    const oldestKey = map.keys().next().value as K;
    const evicted = map.get(oldestKey)!;
    map.delete(oldestKey);
    onEvict?.(evicted);
  }

  map.set(key, value);
};
