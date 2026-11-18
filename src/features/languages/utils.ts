import type { LanguagePair } from "./types";

const getLanguageCounts = (
  languagePairs: LanguagePair[],
  side: "source" | "target",
  otherSideId: number | null,
) => {
  const counts = new Map<number | null, number>();
  for (const pair of languagePairs) {
    const id =
      side === "source" ? pair.sourceLanguageId : pair.targetLanguageId;
    const otherId =
      side === "source" ? pair.targetLanguageId : pair.sourceLanguageId;
    if (otherSideId && otherId !== otherSideId) continue;
    counts.set(id, (counts.get(id) ?? 0) + pair.count);
  }
  return counts;
};

export const getLanguageOptions = (
  languagePairs: LanguagePair[],
  side: "source" | "target",
  otherSideId: number | null,
  displayCounts?: LanguagePair[],
): [number | null, number][] => {
  const wordCounts = getLanguageCounts(languagePairs, side, otherSideId);
  const counts = displayCounts
    ? getLanguageCounts(displayCounts, side, otherSideId)
    : wordCounts;

  return [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => [id, counts.get(id) ?? 0]);
};
