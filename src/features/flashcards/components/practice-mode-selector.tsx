"use client";

import { TooltipTabs } from "@/components/common/tooltip-tabs";
import { PRACTICE_MODE_OPTIONS } from "@/features/flashcards/constants";
import type { PracticeMode } from "@/features/flashcards/types";
import { useI18n } from "@/hooks/use-i18n";

type PracticeModeSelectorProps = {
  className?: string;
  value: PracticeMode;
  onChange: (value: PracticeMode) => void;
  disabled?: boolean;
};

export const PracticeModeSelector = ({
  className,
  value,
  onChange,
  disabled = false,
}: PracticeModeSelectorProps) => {
  const t = useI18n();

  const options = PRACTICE_MODE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`flashcards.${option.label}`),
    tooltip: t(`flashcards.${option.tooltip}`),
  }));

  return (
    <TooltipTabs
      className={className}
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
