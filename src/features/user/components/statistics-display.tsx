"use client";

import { useUserStatistics } from "@/features/user/api/get-user-statistics";
import { FlashcardsAddedBarChart } from "@/features/user/components/flashcards-added-bar-chart";
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

  if (!stats) return;

  if (!isMobile) {
    return (
      <div className={cn("flex flex-col gap-5", className)}>
        <div className="flex h-70 gap-5">
          <StreakCard className="w-2/7" stats={stats} />
          <TranslationsAddedBarChart className="w-5/7" stats={stats} />
        </div>

        <div className="flex h-70 w-full gap-5">
          <LanguagesPieChart className="w-2/7" stats={stats} />
          <FlashcardsAddedBarChart className="w-5/7" stats={stats} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <StreakCard stats={stats} />
      <TranslationsAddedBarChart stats={stats} />
      <LanguagesPieChart stats={stats} />
      <FlashcardsAddedBarChart stats={stats} />
    </div>
  );
};
