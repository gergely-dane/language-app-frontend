import { LanguagePair } from "@/interfaces/language-pair.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useLanguagePairs = () => {
  return useQuery({
    queryKey: ["language-pairs"],
    queryFn: async () => {
      const { data } = await apiClient.get<LanguagePair[]>("/languages/pairs");
      return data;
    },
  });
};
