import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ImportSpreadsheetRequest {
  file: File;
}

interface ImportSpreadsheetResponse {
  importedCount: number;
  failedCount: number;
}

export const useImportSpreadsheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (importData: ImportSpreadsheetRequest) => {
      const { data } = await apiClient.post<ImportSpreadsheetResponse>(
        "/translations/import",
        importData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      queryClient.invalidateQueries({ queryKey: ["language-pairs"] });
    },
    onError: (error) => {
      console.error("Failed to import spreadsheet:", error);
    },
  });
};
