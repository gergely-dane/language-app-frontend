import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Translation {
  id: string;
  word: string;
  translations: string[];
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
