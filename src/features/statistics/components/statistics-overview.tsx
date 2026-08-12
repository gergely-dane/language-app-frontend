"use client";

import { IconBook2, IconChartBar, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStatistics } from "@/features/statistics/api/get-user-statistics";
import { DueReviewsCard } from "@/features/statistics/components/due-reviews-card";
import { StatisticsEmptyState } from "@/features/statistics/components/statistics-empty-state";
import { SummaryCards } from "@/features/statistics/components/summary-cards";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit/add-edit-word-dialog";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type StatisticsOverviewProps = {
  className?: string;
};

export const StatisticsOverview = ({ className }: StatisticsOverviewProps) => {
  const t = useI18n();
  const [addWordOpen, setAddWordOpen] = useState(false);

  const { data: stats, isLoading } = useUserStatistics({ previousDays: 30 });

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-5", className)}>
        <Skeleton className="h-[104px] w-full rounded-lg" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>

        <Skeleton className="h-9 w-56 rounded-md" />
      </div>
    );
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
      <DueReviewsCard stats={stats} />

      <SummaryCards stats={stats} />

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/statistics">
            <IconChartBar className="size-4" />
            {t("statistics.overview.viewFullStatistics")}
          </Link>
        </Button>

        <Button variant="outline" onClick={() => setAddWordOpen(true)}>
          <IconPlus className="size-4" />
          {t("vocabulary.addWord")}
        </Button>

        <Button variant="outline" asChild>
          <Link href="/vocabulary">
            <IconBook2 className="size-4" />
            {t("statistics.overview.browseVocabulary")}
          </Link>
        </Button>
      </div>

      <AddEditWordDialog open={addWordOpen} onOpenChange={setAddWordOpen} />
    </div>
  );
};
