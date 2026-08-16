import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

interface ImportSpreadsheetRequest {
  file: File;
}

const importSpreadsheetResponseSchema = z.object({
  importedCount: z.number(),
  failedCount: z.number(),
});

export const useImportSpreadsheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (importData: ImportSpreadsheetRequest) => {
      const { data } = await apiClient.post<unknown>(
        "/translations/import",
        importData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return importSpreadsheetResponseSchema.parse(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["translations"] });
      void queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      void queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
    onError: (error) => {
      console.error("Failed to import spreadsheet:", error);
    },
  });
};
