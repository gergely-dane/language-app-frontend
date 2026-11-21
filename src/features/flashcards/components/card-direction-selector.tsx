"use client";

import { TooltipTabs } from "@/components/common/tooltip-tabs";
import { CARD_DIRECTION_OPTIONS } from "@/features/flashcards/constants";
import { useI18n } from "@/hooks/use-i18n";

type CardDirectionSelectorProps = {
  className?: string;
  isReverse: boolean;
  onChange: (isReverse: boolean) => void;
};

export const CardDirectionSelector = ({
  className,
  isReverse,
  onChange,
}: CardDirectionSelectorProps) => {
  const t = useI18n();

  const options = CARD_DIRECTION_OPTIONS.map((option) => ({
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
