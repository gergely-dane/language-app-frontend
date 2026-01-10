"use client";

import { useUserStatistics } from "@/features/user/api/get-user-statistics";
import { FlashcardsAddedLineChart } from "@/features/user/components/flashcards-added-line-chart";
import { LanguagesPieChart } from "@/features/user/components/languages-pie-chart";
import { StreakCard } from "@/features/user/components/streak-card";
import { TranslationsAddedBarChart } from "@/features/user/components/translations-added-bar-chart";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

type StatisticsDisplayProps = {
  className?: string;
};

export const StatisticsDisplay = ({ className }: StatisticsDisplayProps) => {
  const isMobile = useIsMobileScreen();
  const { data: stats } = useUserStatistics({ previousDays: 30 });

  if (!isMobile) {
    return (
      <div className={cn("flex flex-col gap-5", className)}>
        <div className="flex gap-5 h-60">
          <StreakCard className="w-2/9" stats={stats} />
          <TranslationsAddedBarChart className="w-7/9" stats={stats} />
        </div>

        <div className="flex w-full gap-5 h-80">
          <LanguagesPieChart className="w-2/5" stats={stats} />
          <FlashcardsAddedLineChart className="w-full" stats={stats} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <StreakCard stats={stats} />
      <TranslationsAddedBarChart stats={stats} />
      <LanguagesPieChart stats={stats} />
      <FlashcardsAddedLineChart stats={stats} />
    </div>
  );
};
