"use client";

import { useState } from "react";

import { PageHeader } from "@/components/common/page-header";
import { StatisticsDisplay } from "@/features/statistics/components/statistics-display";
import { TimePeriodSelector } from "@/features/statistics/components/time-period-selector";
import { useI18n } from "@/hooks/use-i18n";

export const StatisticsPage = () => {
  const t = useI18n();
  const [timePeriod, setTimePeriod] = useState("30");

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height))] w-full">
      <PageHeader
        title={t("general.statistics")}
        subtitle={t("statistics.pageSubtitle")}
        action={
          <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
        }
      />

      <StatisticsDisplay className="mt-6" previousDays={Number(timePeriod)} />
    </div>
  );
};
