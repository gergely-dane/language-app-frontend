import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { LANGUAGES } from "@/features/languages/constants";
import { languageSchema } from "@/features/languages/types";
import { apiClient } from "@/lib/api-client";

export const useLanguages = () => {
  const queryResult = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/languages");
      return z.array(languageSchema).parse(data);
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
