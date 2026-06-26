import { useQuery } from "@tanstack/react-query";

import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { type PaginatedResponse } from "@/interfaces/paginated-response.interface";
import { apiClient } from "@/lib/api-client";

interface GetTranslationsQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortAscending?: boolean;
  sourceLanguageId?: number | null;
  translationLanguageId?: number | null;
}

export const useTranslations = (params: GetTranslationsQuery) =>
  useQuery({
    queryKey: ["translations", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Translation>>(
        "/translations",
        { params },
      );
      return data;
    },
  });
