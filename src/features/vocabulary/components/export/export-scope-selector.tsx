"use client";

import { TooltipTabs } from "@/components/common/tooltip-tabs";
import {
  EXPORT_SCOPE,
  EXPORT_SCOPE_OPTIONS,
} from "@/features/vocabulary/constants";
import type { ExportScope } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";

type ExportScopeSelectorProps = {
  value: ExportScope;
  onChange: (value: ExportScope) => void;
  counts: Record<ExportScope, number>;
  isFiltered: boolean;
  disabled?: boolean;
};

export const ExportScopeSelector = ({
  value,
  onChange,
  counts,
  isFiltered,
  disabled = false,
}: ExportScopeSelectorProps) => {
  const t = useI18n();

  const options = EXPORT_SCOPE_OPTIONS.filter(
    (option) => isFiltered || option.value !== EXPORT_SCOPE.Filtered,
  ).map((option) => ({
    value: option.value,
    label: t(`vocabulary.export.${option.label}`, {
      count: counts[option.value],
    }),
    tooltip: t(`vocabulary.export.${option.tooltip}`),
    disabled: counts[option.value] === 0,
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
