import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { type ExportFormat } from "@/features/vocabulary/types";
import { apiClient } from "@/lib/api-client";

interface ExportTranslationsRequest {
  format: ExportFormat;
  ids?: number[];
  search?: string;
  sourceLanguageId?: number | null;
  targetLanguageId?: number | null;
}

export const useExportTranslations = () =>
  useMutation({
    mutationFn: async (body: ExportTranslationsRequest) => {
      const { data } = await apiClient.post<unknown>(
        "/translations/export",
        body,
        { responseType: "blob" },
      );
      return z.instanceof(Blob).parse(data);
    },
    onError: (error) => {
      console.error("Failed to export translations:", error);
    },
  });
