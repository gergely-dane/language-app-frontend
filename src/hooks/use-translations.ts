import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Word {
  id: number;
  word: string;
}

export interface Translation {
  id: string;
  word: Word;
  translations: Word[];
  sourceLanguageCode: string;
  translationLanguageCode: string;
  createdDate: string;
}

export interface TranslationsResponse extends Translation {}

export interface TranslationsParams {}

export const useTranslations = (params: TranslationsParams) => {
  return useQuery({
    queryKey: ["translations", params],
    queryFn: async () => {
      const { data } = await apiClient.get<TranslationsResponse[]>(
        "/translations",
        {
          params,
        },
      );
      return data;
    },
  });
};
