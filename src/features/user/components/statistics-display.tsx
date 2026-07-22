"use client";

import { useState } from "react";

import { useUserStatistics } from "@/features/user/api/get-user-statistics";
import { ActivityHeatmap } from "@/features/user/components/activity-heatmap";
import { CardStatePieChart } from "@/features/user/components/card-state-pie-chart";
import { FlashcardsAddedBarChart } from "@/features/user/components/flashcards-added-bar-chart";
import { LanguagesPieChart } from "@/features/user/components/languages-pie-chart";
import { StatisticsEmptyState } from "@/features/user/components/statistics-empty-state";
import { StatisticsSkeleton } from "@/features/user/components/statistics-skeleton";
import { SummaryCards } from "@/features/user/components/summary-cards";
import { TimePeriodSelector } from "@/features/user/components/time-period-selector";
import { TodaySummary } from "@/features/user/components/today-summary";
import { TranslationsAddedBarChart } from "@/features/user/components/translations-added-bar-chart";
import { cn } from "@/utils/cn";

type StatisticsDisplayProps = {
  className?: string;
};

export const StatisticsDisplay = ({ className }: StatisticsDisplayProps) => {
  const [timePeriod, setTimePeriod] = useState("30");

  const previousDays = timePeriod === "0" ? 0 : Number(timePeriod);

  const { data: stats, isLoading } = useUserStatistics({
    previousDays: previousDays || 30,
  });

  if (isLoading) {
    return <StatisticsSkeleton className={className} />;
  }

  if (!stats) return null;

  const isEmpty =
    stats.total.totalFlashcardReviews === 0 &&
    stats.total.totalTranslations === 0;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {!isEmpty && (
        <div className="flex flex-wrap items-center gap-3">
          <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
        </div>
      )}

      {isEmpty ? (
        <StatisticsEmptyState />
      ) : (
        <>
          <TodaySummary stats={stats} />

          <SummaryCards stats={stats} />

          <ActivityHeatmap stats={stats} className="lg:min-h-70" />

          {previousDays > 0 && stats.daily && stats.daily.length > 0 && (
            <div
              className={cn(
                "grid grid-cols-1 gap-5",
                previousDays < 90 ? "lg:grid-cols-2" : "",
              )}
            >
              <TranslationsAddedBarChart stats={stats} className="lg:h-70" />

              <FlashcardsAddedBarChart stats={stats} className="lg:h-70" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <LanguagesPieChart className="h-[400px] lg:h-70" stats={stats} />

            <CardStatePieChart className="h-[400px] lg:h-70" stats={stats} />
          </div>
        </>
      )}
    </div>
  );
};
