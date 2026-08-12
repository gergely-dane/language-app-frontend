"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type UserStatistics } from "@/features/statistics/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type DueReviewsCardProps = {
  stats: UserStatistics;
  className?: string;
};

export const DueReviewsCard = ({ stats, className }: DueReviewsCardProps) => {
  const t = useI18n();

  if (!stats.today) return null;

  const due = stats.today.dueFlashcards;

  return (
    <div
      className={cn(
        "bg-card flex flex-col gap-4 rounded-lg border p-5 shadow-sm sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex-1">
        {due > 0 ? (
          <>
            <p className="text-primary text-4xl font-bold">
              {due.toLocaleString()}
            </p>

            <p className="text-muted-foreground mt-1 text-sm">
              {t("statistics.dueCard.cardsDue", { count: due })}
            </p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold">
              {t("statistics.dueCard.allClearTitle")}
            </p>

            <p className="text-muted-foreground mt-1 text-sm">
              {t("statistics.dueCard.allClearDescription")}
            </p>
          </>
        )}
      </div>

      {due > 0 && (
        <Button size="lg" asChild>
          <Link href="/flashcards">
            {t("statistics.dueCard.startReviewing")}

            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
};
