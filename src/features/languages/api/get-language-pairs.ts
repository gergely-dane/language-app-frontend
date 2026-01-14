import { LanguagePair } from "@/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLanguagePairsSuspense = () =>
  useSuspenseQuery({
    queryKey: ["language-pairs"],
    queryFn: async () => {
      const { data } = await apiClient.get<LanguagePair[]>("/languages/pairs");
      return data;
    },
  });
