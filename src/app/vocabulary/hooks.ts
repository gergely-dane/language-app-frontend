import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Word {
  id: number;
  word: string;
}

export interface Translation {
  id: number;
  word: Word;
  translations: Word[];
  sourceLanguageCode: string;
  translationLanguageCode: string;
  createdAt: string;
}

export interface CreateTranslationRequest {
  word: string;
  translation: string;
  sourceLanguageCode: string;
  translationLanguageCode: string;
  knowledgeLevel: number;
}

export interface DeleteTranslationsBulkRequest {
  ids: number[];
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

export const useDeleteTranslationsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: DeleteTranslationsBulkRequest) => {
      await apiClient.post(`/translations/delete-bulk`, body);
      return body;
    },
    onSuccess: ({ ids }) => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      queryClient.setQueryData<Translation[]>(["translations"], (old = []) =>
        old.filter((translation) => !ids.includes(translation.id)),
      );
    },
    onError: (error) => {
      console.error("Failed to delete translation:", error);
    },
  });
};
