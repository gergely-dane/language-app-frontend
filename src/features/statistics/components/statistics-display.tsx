"use client";

import { useUserStatistics } from "@/features/statistics/api/get-user-statistics";
import { ActivityHeatmap } from "@/features/statistics/components/charts/activity-heatmap";
import { CardStatePieChart } from "@/features/statistics/components/charts/card-state-pie-chart";
import { FlashcardsAddedBarChart } from "@/features/statistics/components/charts/flashcards-added-bar-chart";
import { LanguagesPieChart } from "@/features/statistics/components/charts/languages-pie-chart";
import { TranslationsAddedBarChart } from "@/features/statistics/components/charts/translations-added-bar-chart";
import { StatisticsEmptyState } from "@/features/statistics/components/statistics-empty-state";
import { StatisticsSkeleton } from "@/features/statistics/components/statistics-skeleton";
import { SummaryCards } from "@/features/statistics/components/summary-cards";
import { cn } from "@/lib/utils";

type StatisticsDisplayProps = {
  previousDays: number;
  className?: string;
};

export const StatisticsDisplay = ({
  previousDays,
  className,
}: StatisticsDisplayProps) => {
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

  if (isEmpty) {
    return <StatisticsEmptyState className={className} />;
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <SummaryCards stats={stats} variant="detailed" />

      <ActivityHeatmap stats={stats} className="lg:min-h-70" />

      {previousDays > 0 && stats.daily && stats.daily.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-1 gap-5",
            previousDays < 90 ? "lg:grid-cols-2" : "",
          )}
        >
          <TranslationsAddedBarChart stats={stats} />

          <FlashcardsAddedBarChart stats={stats} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <LanguagesPieChart stats={stats} />

        <CardStatePieChart stats={stats} />
      </div>
    </div>
  );
};
