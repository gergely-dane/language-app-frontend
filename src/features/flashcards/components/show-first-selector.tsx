"use client";

import { TooltipTabs } from "@/components/common/tooltip-tabs";
import { SHOW_FIRST_OPTIONS } from "@/features/flashcards/constants";
import { useI18n } from "@/hooks/use-i18n";

type ShowFirstSelectorProps = {
  className?: string;
  isReverse: boolean;
  onChange: (isReverse: boolean) => void;
};

export const ShowFirstSelector = ({
  className,
  isReverse,
  onChange,
}: ShowFirstSelectorProps) => {
  const t = useI18n();

  const options = SHOW_FIRST_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`flashcards.${option.label}`),
    tooltip: t(`flashcards.${option.tooltip}`),
  }));

  return (
    <TooltipTabs
      className={className}
      value={isReverse}
      options={options}
      onChange={onChange}
    />
  );
};
