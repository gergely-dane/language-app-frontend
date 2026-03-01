"use client";

import { useUserStatisticsSuspense } from "@/features/user/api/get-user-statistics";
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
  const { data: stats } = useUserStatisticsSuspense({ previousDays: 30 });

  if (!stats) return;

  if (!isMobile) {
    return (
      <div className={cn("flex flex-col gap-5", className)}>
        <div className="flex h-60 gap-5">
          <StreakCard className="w-2/9" stats={stats} />
          <TranslationsAddedBarChart className="w-7/9" stats={stats} />
        </div>

        <div className="flex h-80 w-full gap-5">
          <LanguagesPieChart className="w-2/5" stats={stats} />
          <FlashcardsAddedBarChart className="w-full" stats={stats} />
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
