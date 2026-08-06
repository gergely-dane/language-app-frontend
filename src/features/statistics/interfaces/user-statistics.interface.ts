interface UserStatisticsTotal {
  successfulFlashcards: number;
  failedFlashcards: number;
  totalTranslations: number;
  translationsMastered: number;
  languages: {
    languageId: number;
    translationsCount: number;
  }[];
  activityStreak: number;
  retentionRate: number;
  averageReviewsPerDay: number;
  daysStudied: number;
  longestStreak: number;
  totalFlashcardReviews: number;
}

export interface UserStatisticsDaily {
  date: Date;
  successfulFlashcards: number;
  failedFlashcards: number;
  easyFlashcards: number;
  wasntSureFlashcards: number;
  newTranslationsAdded: number;
}

export interface UserStatisticsWeekly extends UserStatisticsDaily {
  endDate: Date;
}

interface UserStatisticsCardBreakdown {
  newCards: number;
  learningCards: number;
  reviewCards: number;
  relearningCards: number;
}

interface UserStatisticsHeatmapDay {
  date: string;
  activityCount: number;
  flashcardsDone: number;
  translationsAdded: number;
}

interface UserStatisticsToday {
  flashcardsDone: number;
  translationsAdded: number;
  dueFlashcards: number;
}

export interface UserStatistics {
  total: UserStatisticsTotal;
  daily: UserStatisticsDaily[];
  cardBreakdown?: UserStatisticsCardBreakdown;
  heatmap?: UserStatisticsHeatmapDay[];
  today?: UserStatisticsToday;
}
