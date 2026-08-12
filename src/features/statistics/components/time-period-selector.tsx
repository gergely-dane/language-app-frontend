"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TIME_PERIODS } from "@/features/statistics/constants";
import { useI18n } from "@/hooks/use-i18n";

type TimePeriodSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TimePeriodSelector = ({
  value,
  onChange,
}: TimePeriodSelectorProps) => {
  const t = useI18n();

  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        {TIME_PERIODS.map((period) => (
          <TabsTrigger key={period.value} value={period.value}>
            {t(`statistics.${period.label}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
