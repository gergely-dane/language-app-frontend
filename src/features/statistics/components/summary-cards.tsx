"use client";

import {
  IconCalendarCheck,
  IconCards,
  IconFlame,
  IconTargetArrow,
} from "@tabler/icons-react";

import { type UserStatistics } from "@/features/statistics/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type SummaryCardsProps = {
  stats: UserStatistics;
  className?: string;
};

export const SummaryCards = ({ stats, className }: SummaryCardsProps) => {
  const t = useI18n();

  const cards = [
    {
      icon: IconFlame,
      label: t("statistics.summaryCards.currentStreak"),
      value: stats.total.activityStreak,
      suffix: t("statistics.summaryCards.days", {
        count: stats.total.activityStreak,
      }),
      color: "text-orange-500",
    },
    {
      icon: IconTargetArrow,
      label: t("statistics.summaryCards.retentionRate"),
      value: `${Math.round(stats.total.retentionRate)}%`,
      color:
        stats.total.retentionRate >= 80
          ? "text-emerald-500"
          : stats.total.retentionRate >= 60
            ? "text-amber-500"
            : "text-red-500",
    },
    {
      icon: IconCards,
      label: t("statistics.summaryCards.totalReviews"),
      value: stats.total.totalFlashcardReviews.toLocaleString(),
      color: "text-primary",
    },
    {
      icon: IconCalendarCheck,
      label: t("statistics.summaryCards.daysStudied"),
      value: stats.total.daysStudied,
      subtitle: t("statistics.summaryCards.longestStreak"),
      subtitleValue: `${stats.total.longestStreak}`,
      color: "text-sky-500",
    },
  ];

  return (
    <div
      className={cn(
        "grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5",
        className,
      )}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card flex h-full flex-col gap-1 rounded-lg border p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <card.icon className={cn("size-4", card.color)} />

            <p className="text-muted-foreground text-sm font-medium">
              {card.label}
            </p>
          </div>

          <p className={cn("text-2xl font-bold", card.color)}>
            {card.value}
            {card.suffix && (
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                {card.suffix}
              </span>
            )}
          </p>

          {card.subtitle && (
            <p className="text-muted-foreground text-xs">
              {card.subtitle}: {card.subtitleValue}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
