"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

import { AlertProvider } from "@/context/alert-context";
import { AuthProvider } from "@/context/auth-context";
import { type I18nConfig } from "@/interfaces/i18n-config.interface";
import { getQueryClient } from "@/lib/query-client";

type AppProviderProps = {
  i18nConfig: I18nConfig;
  children: ReactNode;
};

export const AppProvider = ({ i18nConfig, children }: AppProviderProps) => {
  const isDevEnvironment = process.env.NODE_ENV === "development";
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {isDevEnvironment && <ReactQueryDevtools initialIsOpen={false} />}
      <AuthProvider>
        <NextIntlClientProvider
          locale={i18nConfig.locale}
          messages={i18nConfig.messages}
          timeZone={i18nConfig.timeZone}
        >
          <ThemeProvider attribute="class" enableSystem>
            <AlertProvider>{children}</AlertProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
