"use client";

import { useState } from "react";

import { useAlert } from "@/context/alert-context";
import { useImportSpreadsheet } from "@/features/vocabulary/api/import-spreadsheet";
import { useI18n } from "@/hooks/use-i18n";

export const useImportFile = (onImported: () => void) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const importSpreadsheet = useImportSpreadsheet();

  const [file, setFile] = useState<File | null>(null);

  const importFile = async () => {
    if (!file) return;

    try {
      const response = await importSpreadsheet.mutateAsync({ file });
      onImported();
      showAlert({
        title: `${t("vocabulary.successfullyImported")} ${response.importedCount} ${t("vocabulary.translations")}.`,
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title:
          (error.response?.data?.message as string) ||
          t("vocabulary.anErrorOccurredWhileImportingTranslations"),
        variant: "destructive",
      });
    }
  };

  return {
    file,
    setFile,
    importFile,
    isPending: importSpreadsheet.isPending,
  };
};
