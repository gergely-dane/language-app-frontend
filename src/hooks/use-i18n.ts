import { useTranslations } from "next-intl";

export const useI18n = (namespace?: string) => useTranslations(namespace);
