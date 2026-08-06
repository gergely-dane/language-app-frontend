import { getRequestConfig } from "next-intl/server";

import type {
  I18nConfig,
  I18nMessages,
} from "@/interfaces/i18n-config.interface";

const buildI18nConfig = async (): Promise<I18nConfig> => {
  const locale = "en";
  const namespaces = [
    "auth",
    "flashcards",
    "general",
    "settings",
    "statistics",
    "vocabulary",
  ];

  try {
    const messages = (
      await Promise.all(
        namespaces.map(async (ns) => ({
          [ns]: (
            (await import(`./messages/${ns}/${locale}.json`)) as {
              default: I18nMessages;
            }
          ).default,
        })),
      )
    ).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return {
      locale,
      messages,
      timeZone: "UTC",
    };
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
};

export const getI18nConfig = async () => buildI18nConfig();

export default getRequestConfig(buildI18nConfig);
