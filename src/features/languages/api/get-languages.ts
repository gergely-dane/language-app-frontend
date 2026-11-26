import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { type Language, languageSchema } from "@/features/languages/types";
import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
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
  const { data: settings, isLoading: isSettingsLoading } = useGetUserSettings();

  const getLanguageName = (language: Language) => {
    if (isSettingsLoading) return "";

    return settings?.showNativeLanguageNames
      ? language.nativeName
      : language.englishName;
  };

  const getLanguageCode = (id?: number) =>
    queryResult?.data?.find((lang) => lang.id === id)?.code || "";

  const getLanguageString = (id?: number | null) => {
    const language = id
      ? queryResult.data?.find((lang) => lang.id === id)
      : undefined;
    return language ? getLanguageName(language) : "";
  };

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || isSettingsLoading,
    getLanguageName,
    getLanguageString,
    getLanguageCode,
  };
};
