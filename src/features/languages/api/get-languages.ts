import { useSuspenseQuery } from "@tanstack/react-query";

import { type Language } from "@/features/languages/interfaces/language.interface";
import { apiClient } from "@/lib/api-client";
import { LANGUAGES } from "@/lib/constants";

export const useLanguages = () => {
  const queryResult = useSuspenseQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await apiClient.get<Language[]>("/languages");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const getLanguageCode = (id?: number) =>
    queryResult?.data?.find((lang) => lang.id === id)?.code || "";

  const getLanguageString = (id?: number) => {
    const code = getLanguageCode(id);
    return code ? LANGUAGES[code] || "" : "";
  };

  return { ...queryResult, getLanguageString, getLanguageCode };
};
