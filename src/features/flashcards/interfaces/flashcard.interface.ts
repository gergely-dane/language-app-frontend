import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";

export interface Flashcard {
  translation: Translation;
  dontKnowNextReviewMinutes: number;
  notSureNextReviewMinutes: number;
  knowItNextReviewMinutes: number;
}
