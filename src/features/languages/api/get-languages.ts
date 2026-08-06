import { useQuery } from "@tanstack/react-query";

import { LANGUAGES } from "@/features/languages/constants";
import { type Language } from "@/features/languages/interfaces/language.interface";
import { apiClient } from "@/lib/api-client";

export const useLanguages = () => {
  const queryResult = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await apiClient.get<Language[]>("/languages");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const getLanguageCode = (id?: number) =>
    queryResult?.data?.find((lang) => lang.id === id)?.code || "";

  const getLanguageString = (id?: number | null) => {
    const code = id ? getLanguageCode(id) : undefined;
    return code ? LANGUAGES[code] || "" : "";
  };

  return { ...queryResult, getLanguageString, getLanguageCode };
};
