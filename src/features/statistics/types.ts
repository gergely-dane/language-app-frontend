import { z } from "zod";

const userStatisticsTotalSchema = z.object({
  successfulFlashcards: z.number(),
  easyFlashcards: z.number(),
  failedFlashcards: z.number(),
  wasntSureFlashcards: z.number(),
  totalTranslations: z.number(),
  translationsMastered: z.number(),
  languages: z.array(
    z.object({
      languageId: z.number(),
      translationsCount: z.number(),
    }),
  ),
  activityStreak: z.number(),
  retentionRate: z.number(),
  averageReviewsPerDay: z.number(),
  daysStudied: z.number(),
  longestStreak: z.number(),
  totalFlashcardReviews: z.number(),
});

const userStatisticsDailySchema = z.object({
  date: z.string(),
  successfulFlashcards: z.number(),
  failedFlashcards: z.number(),
  easyFlashcards: z.number(),
  wasntSureFlashcards: z.number(),
  newTranslationsAdded: z.number(),
});

const userStatisticsCardBreakdownSchema = z.object({
  newCards: z.number(),
  learningCards: z.number(),
  reviewCards: z.number(),
  relearningCards: z.number(),
});

const userStatisticsHeatmapDaySchema = z.object({
  date: z.string(),
  activityCount: z.number(),
  flashcardsDone: z.number(),
  translationsAdded: z.number(),
});

const userStatisticsTodaySchema = z.object({
  flashcardsDone: z.number(),
  translationsAdded: z.number(),
  dueFlashcards: z.number(),
});

export const userStatisticsSchema = z.object({
  total: userStatisticsTotalSchema,
  daily: z
    .array(userStatisticsDailySchema)
    .nullish()
    .transform((value) => value ?? []),
  cardBreakdown: userStatisticsCardBreakdownSchema.nullish(),
  heatmap: z.array(userStatisticsHeatmapDaySchema).nullish(),
  today: userStatisticsTodaySchema.nullish(),
});

export type UserStatisticsDaily = z.infer<typeof userStatisticsDailySchema>;

export type UserStatisticsWeekly = UserStatisticsDaily & { endDate: string };

export type UserStatistics = z.infer<typeof userStatisticsSchema>;
