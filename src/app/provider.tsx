"use client";

import { AlertProvider } from "@/context/alert-context";
import { AuthProvider } from "@/context/auth-context";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextIntlClientProvider } from "next-intl";
import { RequestConfig } from "next-intl/dist/types/server/react-server/getRequestConfig";
import { ReactNode } from "react";

type AppProviderProps = {
  i18nConfig: RequestConfig;
  children: ReactNode;
};

export const AppProvider = ({ i18nConfig, children }: AppProviderProps) => {
  const isDevEnvironment = process.env.NODE_ENV === "development";

  return (
    <QueryClientProvider client={queryClient}>
      {isDevEnvironment && <ReactQueryDevtools initialIsOpen={false} />}
      <AuthProvider>
        <NextIntlClientProvider
          locale={i18nConfig.locale}
          messages={i18nConfig.messages}
        >
          <AlertProvider>{children}</AlertProvider>
        </NextIntlClientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
