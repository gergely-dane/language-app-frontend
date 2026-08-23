import { storedLanguageIdSchema } from "@/features/vocabulary/types";

export const getStoredLanguageId = (key: string): number | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) return null;

    const result = storedLanguageIdSchema.safeParse(stored);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const storeLastAddedLanguageId = (key: string, languageId: number) => {
  try {
    window.localStorage.setItem(key, String(languageId));
  } catch {
    // storage unavailable (private mode, quota)
  }
};

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
