import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { type BaseEntity } from "@/interfaces/base-entity.interface";

export interface Flashcard extends BaseEntity {
  translation: Translation;
  score: number;
}
