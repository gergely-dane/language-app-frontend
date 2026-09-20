"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  const handleValueChange = (newValue: string) => {
    const option = PRACTICE_MODE_OPTIONS.find(
      (option) => String(option.value) === newValue,
    );
    if (option) onChange(option.value);
  };

  return (
    <Tabs
      className={className}
      value={String(value)}
      onValueChange={handleValueChange}
    >
      <TabsList className="w-full">
        {PRACTICE_MODE_OPTIONS.map((option) => (
          <Tooltip key={option.value}>
            {/* TabsTrigger must be the outer element: both Radix triggers spread props after their own data-state, so the inner one loses. */}
            <TabsTrigger
              asChild
              value={String(option.value)}
              disabled={disabled}
            >
              <TooltipTrigger>{t(`flashcards.${option.label}`)}</TooltipTrigger>
            </TabsTrigger>

            <TooltipContent>
              <p>{t(`flashcards.${option.tooltip}`)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TabsList>
    </Tabs>
  );
};
