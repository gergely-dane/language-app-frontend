"use client";

import { IconDownload } from "@tabler/icons-react";
import { useState } from "react";

import { LabeledGroup } from "@/components/common/labeled-group";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAlert } from "@/context/alert-context";
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useExportTranslations } from "@/features/vocabulary/api/export-translations";
import { ExportFormatSelector } from "@/features/vocabulary/components/export/export-format-selector";
import { ExportScopeSelector } from "@/features/vocabulary/components/export/export-scope-selector";
import { EXPORT_FORMAT, EXPORT_SCOPE } from "@/features/vocabulary/constants";
import type {
  ExportFilter,
  ExportFormat,
  ExportScope,
} from "@/features/vocabulary/types";
import {
  getDefaultExportScope,
  getExportFileName,
} from "@/features/vocabulary/utils";
import { useI18n } from "@/hooks/use-i18n";
import { downloadFile } from "@/lib/utils";

type ExportFormContentProps = {
  selectedIds: number[];
  filter: ExportFilter;
  isFiltered: boolean;
  filteredCount: number;
  onClose: () => void;
};

export const ExportFormContent = ({
  selectedIds,
  filter,
  isFiltered,
  filteredCount,
  onClose,
}: ExportFormContentProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const { data: languagePairs } = useLanguagePairs();
  const exportTranslations = useExportTranslations();

  const counts: Record<ExportScope, number> = {
    [EXPORT_SCOPE.Selected]: selectedIds.length,
    [EXPORT_SCOPE.Filtered]: filteredCount,
    [EXPORT_SCOPE.All]:
      languagePairs?.reduce((sum, pair) => sum + pair.count, 0) ?? 0,
  };

  const [scope, setScope] = useState<ExportScope>(() =>
    getDefaultExportScope(counts, isFiltered),
  );
  const [format, setFormat] = useState<ExportFormat>(EXPORT_FORMAT.Xlsx);

  const handleExport = async () => {
    try {
      const file = await exportTranslations.mutateAsync({
        format,
        ...(scope === EXPORT_SCOPE.Selected && { ids: selectedIds }),
        ...(scope === EXPORT_SCOPE.Filtered && filter),
      });

      downloadFile(file, getExportFileName(format));
      onClose();
      showAlert({
        title: t("vocabulary.export.success", { count: counts[scope] }),
      });
    } catch {
      showAlert({
        title: t("vocabulary.export.error"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("vocabulary.export.title")}</DialogTitle>

        <DialogDescription>
          {t("vocabulary.export.description")}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <LabeledGroup label={t("vocabulary.export.scope")}>
          <ExportScopeSelector
            value={scope}
            onChange={setScope}
            counts={counts}
            isFiltered={isFiltered}
            disabled={exportTranslations.isPending}
          />
        </LabeledGroup>

        <LabeledGroup label={t("vocabulary.export.format")}>
          <ExportFormatSelector
            value={format}
            onChange={setFormat}
            disabled={exportTranslations.isPending}
          />
        </LabeledGroup>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={exportTranslations.isPending}
        >
          {t("general.cancel")}
        </Button>

        <Button
          onClick={() => void handleExport()}
          isLoading={exportTranslations.isPending}
          disabled={counts[scope] === 0}
        >
          <IconDownload />
          {t("vocabulary.export.confirm")}
        </Button>
      </DialogFooter>
    </>
  );
};
