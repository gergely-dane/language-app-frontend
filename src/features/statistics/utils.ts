import {
  type UserStatisticsDaily,
  type UserStatisticsWeekly,
} from "@/features/statistics/interfaces/user-statistics.interface";

export function groupStatsByWeek(
  daily: UserStatisticsDaily[],
): UserStatisticsWeekly[] {
  if (!daily || daily.length === 0) return [];

  const grouped: UserStatisticsWeekly[] = [];
  const reversed = [...daily].reverse();

  for (let i = 0; i < reversed.length; i += 7) {
    const chunk = reversed.slice(i, i + 7);
    const oldestInChunk = chunk[chunk.length - 1];
    const newestInChunk = chunk[0];

    grouped.push({
      date: oldestInChunk.date,
      endDate: newestInChunk.date,
      successfulFlashcards: chunk.reduce(
        (sum, d) => sum + d.successfulFlashcards,
        0,
      ),
      failedFlashcards: chunk.reduce((sum, d) => sum + d.failedFlashcards, 0),
      easyFlashcards: chunk.reduce((sum, d) => sum + d.easyFlashcards, 0),
      wasntSureFlashcards: chunk.reduce(
        (sum, d) => sum + d.wasntSureFlashcards,
        0,
      ),
      newTranslationsAdded: chunk.reduce(
        (sum, d) => sum + d.newTranslationsAdded,
        0,
      ),
    });
  }

  return grouped.reverse();
}

export function getIntensityClass(count: number, maxCount: number): string {
  if (count === 0) return "fill-muted";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "fill-emerald-900/40 dark:fill-emerald-400/30";
  if (ratio <= 0.5) return "fill-emerald-700/60 dark:fill-emerald-400/50";
  if (ratio <= 0.75) return "fill-emerald-600/80 dark:fill-emerald-400/70";
  return "fill-emerald-500 dark:fill-emerald-400/90";
}
