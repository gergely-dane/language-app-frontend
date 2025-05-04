import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface Word {
  id: string;
  originalWord: string;
  translatedWord: string;
  originalLanguageEnglish: string;
  translationLanguageEnglish: string;
  createdDate: string;
}

export interface WordsResponse extends Word {}

export interface WordsParams {}

export const useWords = (params: WordsParams) => {
  return useQuery({
    queryKey: ["words", params],
    queryFn: async () => {
      const { data } = await apiClient.get<Word[]>("/words", {
        params,
      });
      return data;
    },
  });
};
