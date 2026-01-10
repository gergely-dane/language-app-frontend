interface UserStatisticsTotal {
  successfulFlashcards: number;
  failedFlashcards: number;
  totalTranslations: number;
  translationsMastered: number;
  languagePairs: [
    {
      sourceLanguageId: number;
      translationLanguageId: number;
      translationsCount: number;
    },
    {
      sourceLanguageId: number;
      translationLanguageId: number;
      translationsCount: number;
    },
  ];
  activityStreak: number;
}

interface UserStatisticsDaily {
  date: Date;
  successfulFlashcards: number;
  failedFlashcards: number;
  newTranslationsAdded: number;
}

export interface UserStatistics {
  total: UserStatisticsTotal;
  daily: UserStatisticsDaily[];
}
