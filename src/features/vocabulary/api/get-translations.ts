import { useQuery } from "@tanstack/react-query";

import { translationSchema } from "@/features/vocabulary/types";
import { apiClient } from "@/lib/api-client";
import { paginatedResponseSchema } from "@/types";

interface GetTranslationsQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortAscending?: boolean;
  sourceLanguageId?: number | null;
  targetLanguageId?: number | null;
}

export const useTranslations = (params: GetTranslationsQuery) =>
  useQuery({
    queryKey: ["translations", params],
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/translations", {
        params,
      });
      return paginatedResponseSchema(translationSchema).parse(data);
    },
  });
