"use client";

import { useState } from "react";

import { PageHeader } from "@/components/common/page-header";
import { LanguageFilterSelect } from "@/features/statistics/components/language-filter-select";
import { StatisticsDisplay } from "@/features/statistics/components/statistics-display";
import { TimePeriodSelector } from "@/features/statistics/components/time-period-selector";
import { useI18n } from "@/hooks/use-i18n";

export const StatisticsPage = () => {
  const t = useI18n();
  const [timePeriod, setTimePeriod] = useState("30");
  const [languageId, setLanguageId] = useState<number | null>(null);

  return (
    <div className="w-full self-start">
      <PageHeader
        title={t("general.statistics")}
        subtitle={t("statistics.pageSubtitle")}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <LanguageFilterSelect value={languageId} onChange={setLanguageId} />

            <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
          </div>
        }
      />

      <StatisticsDisplay
        className="mt-6"
        previousDays={Number(timePeriod)}
        languageId={languageId}
      />
    </div>
  );
};
