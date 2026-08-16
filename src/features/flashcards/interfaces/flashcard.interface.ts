import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";

export interface Flashcard {
  id: number;
  translation: Translation;
  dontKnowNextReviewMinutes: number;
  notSureNextReviewMinutes: number;
  knowItNextReviewMinutes: number;
  easyNextReviewMinutes: number;
  remainingCount: number;
}
