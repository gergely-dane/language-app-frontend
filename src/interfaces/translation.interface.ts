import { type BaseEntity } from "@/interfaces/base-entity.interface";

export interface Word {
  id: number;
  word: string;
}

export interface Translation extends BaseEntity {
  id: number;
  word: Word;
  translations: Word[];
  sourceLanguageId: number;
  translationLanguageId: number;
  definition?: string;
}
