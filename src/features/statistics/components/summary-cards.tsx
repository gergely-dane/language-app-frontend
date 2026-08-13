"use client";

import {
  IconAward,
  IconBook2,
  IconCards,
  IconFlame,
  IconTargetArrow,
  type TablerIcon,
} from "@tabler/icons-react";

import { type UserStatistics } from "@/features/statistics/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type SummaryCardsProps = {
  stats: UserStatistics;
  /** "overview" for the homepage set, "detailed" for the statistics page. */
  variant?: "overview" | "detailed";
  className?: string;
};

type SummaryCard = {
  icon: TablerIcon;
  label: string;
  value: string | number;
  suffix?: string;
  subtitle?: string;
  color: string;
};

export const SummaryCards = ({
  stats,
  variant = "overview",
  className,
}: SummaryCardsProps) => {
  const t = useI18n();

  const retentionColor =
    stats.total.retentionRate >= 80
      ? "text-emerald-500"
      : stats.total.retentionRate >= 60
        ? "text-amber-500"
        : "text-red-500";

  const streakCard: SummaryCard = {
    icon: IconFlame,
    label: t("statistics.summaryCards.currentStreak"),
    value: stats.total.activityStreak,
    suffix: t("statistics.summaryCards.days", {
      count: stats.total.activityStreak,
    }),
    subtitle: `${t("statistics.summaryCards.longestStreak")}: ${stats.total.longestStreak}`,
    color: "text-orange-500",
  };

  const cards: SummaryCard[] =
    variant === "overview"
      ? [
          streakCard,
          {
            icon: IconTargetArrow,
            label: t("statistics.summaryCards.retentionRate"),
            value: `${Math.round(stats.total.retentionRate)}%`,
            color: retentionColor,
          },
          {
            icon: IconBook2,
            label: t("statistics.summaryCards.words"),
            value: stats.total.totalTranslations.toLocaleString(),
            subtitle: `${t("statistics.summaryCards.mastered")}: ${stats.total.translationsMastered.toLocaleString()}`,
            color: "text-violet-500",
          },
          {
            icon: IconCards,
            label: t("statistics.summaryCards.totalReviews"),
            value: stats.total.totalFlashcardReviews.toLocaleString(),
            subtitle: `${t("statistics.summaryCards.daysStudied")}: ${stats.total.daysStudied}`,
            color: "text-primary",
          },
        ]
      : [
          streakCard,
          {
            icon: IconTargetArrow,
            label: t("statistics.summaryCards.retentionRate"),
            value: `${Math.round(stats.total.retentionRate)}%`,
            subtitle: t("statistics.summaryCards.ofReviewsRecalled"),
            color: retentionColor,
          },
          {
            icon: IconCards,
            label: t("statistics.summaryCards.reviewsPerDay"),
            value: stats.total.averageReviewsPerDay.toFixed(1),
            subtitle: `${t("statistics.summaryCards.daysStudied")}: ${stats.total.daysStudied}`,
            color: "text-primary",
          },
          {
            icon: IconAward,
            label: t("statistics.summaryCards.mastered"),
            value: stats.total.translationsMastered.toLocaleString(),
            subtitle: t("statistics.summaryCards.ofNWords", {
              total: stats.total.totalTranslations.toLocaleString(),
            }),
            color: "text-violet-500",
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

            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {card.label}
            </p>
          </div>

          <p className={cn("font-mono text-2xl font-medium", card.color)}>
            {card.value}
            {card.suffix && (
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                {card.suffix}
              </span>
            )}
          </p>

          {card.subtitle && (
            <p className="text-muted-foreground text-xs">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
};
