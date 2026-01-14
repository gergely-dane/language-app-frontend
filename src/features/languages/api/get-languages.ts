import { Language } from "@/interfaces/language.interface";
import { apiClient } from "@/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLanguages = () => {
  const queryResult = useSuspenseQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await apiClient.get<Language[]>("/languages");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const getLanguage = (id?: number) =>
    queryResult?.data?.find((lang) => lang.id === id);

  return { ...queryResult, getLanguage };
};
