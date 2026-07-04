import { type BaseEntity } from "@/interfaces/base-entity.interface";

import type { Word } from "./word.interface";

export interface Translation extends BaseEntity {
  id: number;
  word: Word;
  translations: Word[];
  sourceLanguageId: number;
  targetLanguageId: number;
  definition?: string;
}
