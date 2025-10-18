import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export interface Language {
  id: string;
  englishName: string;
  nativeName: string;
  code: string;
}

export interface LanguagesResponse extends Language {}

export const useLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await apiClient.get<LanguagesResponse[]>("/languages");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};
