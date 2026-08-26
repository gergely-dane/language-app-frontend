import { MAX_TAG_LENGTH, MAX_TAGS } from "@/features/vocabulary/constants";
import { storedLanguageIdSchema } from "@/features/vocabulary/types";

const parseTagParts = (value: string, existingTags: string[]): string[] => {
  const parts = value
    .split(",")
    .map((part) => part.trim().slice(0, MAX_TAG_LENGTH))
    .filter((part) => part && !existingTags.includes(part));

  return [...new Set(parts)];
};

export const parseTagInput = (
  value: string,
  existingTags: string[],
): string[] =>
  [...existingTags, ...parseTagParts(value, existingTags)].slice(0, MAX_TAGS);

export const replaceTagAt = (
  tags: string[],
  index: number,
  value: string,
): string[] => {
  const others = tags.filter((_, i) => i !== index);
  const parts = parseTagParts(value, others);

  return [...others.slice(0, index), ...parts, ...others.slice(index)].slice(
    0,
    MAX_TAGS,
  );
};

export const moveTag = (tags: string[], from: number, to: number): string[] => {
  const next = [...tags];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

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
