import { useSuspenseQuery } from "@tanstack/react-query";

import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";

export const useLanguagePairsSuspense = () =>
  useSuspenseQuery({
    queryKey: ["language-pairs"],
    queryFn: async () => {
      const { data } = await apiClient.get<LanguagePair[]>("/languages/pairs");
      return data;
    },
  });
