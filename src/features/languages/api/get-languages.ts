import { Language } from "@/interfaces/language.interface";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useLanguages = () => {
  const queryResult = useQuery({
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
