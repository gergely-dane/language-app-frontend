import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export interface CreateTranslationRequest {
  word: string;
  translation: string;
  sourceLanguage: string;
  translationLanguage: string;
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

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTranslation: CreateTranslationRequest) => {
      const { data } = await apiClient.post<Translation>(
        "/translations",
        newTranslation,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });

      queryClient.setQueryData<Translation[]>(["translations"], (old = []) => [
        ...old,
        data,
      ]);
    },
    onError: (error) => {
      console.error("Failed to create translation:", error);
    },
  });
};
