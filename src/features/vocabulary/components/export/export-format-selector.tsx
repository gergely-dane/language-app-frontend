"use client";

import { TooltipTabs } from "@/components/common/tooltip-tabs";
import { EXPORT_FORMAT_OPTIONS } from "@/features/vocabulary/constants";
import type { ExportFormat } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";

type ExportFormatSelectorProps = {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
  disabled?: boolean;
};

export const ExportFormatSelector = ({
  value,
  onChange,
  disabled = false,
}: ExportFormatSelectorProps) => {
  const t = useI18n();

  const options = EXPORT_FORMAT_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`vocabulary.export.${option.label}`),
    tooltip: t(`vocabulary.export.${option.tooltip}`),
  }));

  return (
    <TooltipTabs
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
