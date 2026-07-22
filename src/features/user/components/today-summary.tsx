"use client";

import { IconCards, IconPlus, IconStack2 } from "@tabler/icons-react";

import { type UserStatistics } from "@/features/user/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

type TodaySummaryProps = {
  stats: UserStatistics;
  className?: string;
};

export const TodaySummary = ({ stats, className }: TodaySummaryProps) => {
  const t = useI18n();
  const today = stats.today;

  if (!today) return null;

  const items = [
    {
      icon: IconCards,
      label: t("statistics.today.flashcardsDone"),
      value: today.flashcardsDone,
      color: "text-emerald-500",
    },
    {
      icon: IconPlus,
      label: t("statistics.today.translationsAdded"),
      value: today.translationsAdded,
      color: "text-sky-500",
    },
    {
      icon: IconStack2,
      label: t("statistics.today.dueFlashcards"),
      value: today.dueFlashcards,
      color: today.dueFlashcards > 0 ? "text-amber-500" : "text-emerald-500",
    },
  ];

  return (
    <div
      className={cn(
        "bg-card flex flex-col items-start gap-3 rounded-lg border p-4 shadow-sm md:flex-row md:items-center md:gap-6",
        className,
      )}
    >
      <p className="text-sm font-semibold">{t("statistics.today.title")}</p>

      <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <item.icon className={cn("size-4 shrink-0", item.color)} />

            <span className="text-muted-foreground text-sm text-nowrap">
              {item.label}
            </span>

            <span className={cn("text-lg font-bold", item.color)}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
