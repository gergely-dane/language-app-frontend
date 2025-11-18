import { BaseEntity } from "@/interfaces/base-entity.interface";
import { Translation } from "./translation.interface";

export interface Flashcard extends BaseEntity {
  translation: Translation;
  score: number;
}
