import { type BaseEntity } from "@/interfaces/base-entity.interface";

import { type Translation } from "./translation.interface";

export interface Flashcard extends BaseEntity {
  translation: Translation;
  score: number;
}
