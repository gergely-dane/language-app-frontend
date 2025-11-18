import { BaseEntity } from "@/interfaces/base-entity.interface";

export interface Word {
  id: number;
  word: string;
}

export interface Translation extends BaseEntity {
  word: Word;
  translations: Word[];
  sourceLanguageCode: string;
  translationLanguageCode: string;
  definition?: string;
}
