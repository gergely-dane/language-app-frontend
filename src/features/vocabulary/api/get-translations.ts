import { PaginatedResponse } from "@/interfaces/paginated-response.interface";
import { Translation } from "@/interfaces/translation.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface GetTranslationsQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortAscending?: boolean;
  sourceLanguageId?: string;
  translationLanguageId?: string;
}

export const useTranslations = (params: GetTranslationsQuery) => {
  return useQuery({
    queryKey: ["translations", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Translation>>(
        "/translations",
        {
          params,
        },
      );
      return data;
    },
  });
};
