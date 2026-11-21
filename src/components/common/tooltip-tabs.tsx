"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";

type TooltipTabsOption<T> = {
  value: T;
  label: string;
  tooltip: string;
  disabled?: boolean;
};

type TooltipTabsProps<T> = {
  className?: string;
  value: T;
  options: readonly TooltipTabsOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export const TooltipTabs = <T extends string | number | boolean>({
  className,
  value,
  options,
  onChange,
  disabled = false,
}: TooltipTabsProps<T>) => {
  const handleValueChange = (newValue: string) => {
    const option = options.find((option) => String(option.value) === newValue);
    if (option) onChange(option.value);
  };

  return (
    <Tabs
      className={className}
      value={String(value)}
      onValueChange={handleValueChange}
    >
      <TabsList className="w-full">
        {options.map((option) => (
          <Tooltip key={String(option.value)} content={option.tooltip}>
            <TabsTrigger
              value={String(option.value)}
              disabled={disabled || option.disabled}
            >
              {option.label}
            </TabsTrigger>
          </Tooltip>
        ))}
      </TabsList>
    </Tabs>
  );
};
