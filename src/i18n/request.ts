import * as fs from "fs";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en";
  const namespaces = fs.readdirSync("src/i18n/messages");

  try {
    const messages = (
      await Promise.all(
        namespaces.map(async (ns) => ({
          [ns]: (await import(`./messages/${ns}/${locale}.json`)).default,
        })),
      )
    ).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
});
