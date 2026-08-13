"use client";

import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CELL_SIZE,
  DAYS_IN_WEEK,
  TOTAL_CELL,
  WEEKS,
} from "@/features/statistics/constants";
import { type UserStatistics } from "@/features/statistics/interfaces/user-statistics.interface";
import { getIntensityClass } from "@/features/statistics/utils";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type ActivityHeatmapProps = {
  stats: UserStatistics;
  className?: string;
};

export const ActivityHeatmap = ({ stats, className }: ActivityHeatmapProps) => {
  const t = useI18n();

  const { grid, maxCount } = useMemo(() => {
    const activityMap = new Map<
      string,
      { count: number; flashcards: number; translations: number }
    >();
    for (const day of stats.heatmap ?? []) {
      activityMap.set(day.date, {
        count: day.activityCount,
        flashcards: day.flashcardsDone,
        translations: day.translationsAdded,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const grid: {
      date: Date;
      count: number;
      flashcards: number;
      translations: number;
      week: number;
      day: number;
    }[] = [];
    let maxCount = 1;
    const current = new Date(startDate);

    for (let week = 0; week < WEEKS; week++) {
      for (let day = 0; day < DAYS_IN_WEEK; day++) {
        const dateStr = current.toISOString().slice(0, 10);
        const data = activityMap.get(dateStr) ?? {
          count: 0,
          flashcards: 0,
          translations: 0,
        };
        if (data.count > maxCount) maxCount = data.count;

        grid.push({
          date: new Date(current),
          count: data.count,
          flashcards: data.flashcards,
          translations: data.translations,
          week,
          day,
        });

        current.setDate(current.getDate() + 1);
      }
    }

    return { grid, maxCount };
  }, [stats.heatmap]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; week: number }[] = [];
    let lastMonth = -1;

    for (const cell of grid) {
      if (cell.day !== 0) continue;
      const month = cell.date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: cell.date.toLocaleDateString("en-US", { month: "short" }),
          week: cell.week,
        });
        lastMonth = month;
      }
    }

    return labels;
  }, [grid]);

  const svgWidth = WEEKS * TOTAL_CELL;
  const svgHeight = DAYS_IN_WEEK * TOTAL_CELL + 20;

  return (
    <div
      className={cn(
        "bg-card hidden w-full flex-col overflow-x-auto rounded-lg border p-4 shadow-sm md:flex",
        className,
      )}
    >
      <h2 className="shrink-0 text-sm">{t("statistics.heatmap.title")}</h2>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center pt-4">
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block"
          role="img"
          aria-label={t("statistics.heatmap.title")}
        >
          {monthLabels.map((m) => (
            <text
              key={`${m.label}-${m.week}`}
              x={m.week * TOTAL_CELL}
              y={12}
              className="fill-muted-foreground text-[10px]"
            >
              {m.label}
            </text>
          ))}

          {grid.map((cell) => (
            <Tooltip key={`${cell.week}-${cell.day}`}>
              <TooltipTrigger asChild>
                <rect
                  x={cell.week * TOTAL_CELL}
                  y={cell.day * TOTAL_CELL + 18}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={2}
                  className={cn(
                    "transition-opacity hover:opacity-80",
                    getIntensityClass(cell.count, maxCount),
                  )}
                />
              </TooltipTrigger>

              <TooltipContent className="border-border/50 bg-background text-foreground grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl [&_svg]:!hidden [&>svg]:!hidden [&>svg]:!opacity-0">
                <div className="font-medium">
                  {cell.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {cell.count > 0 ? (
                  <div className="grid gap-1.5">
                    {cell.flashcards > 0 && (
                      <div className="flex w-full items-center gap-2">
                        <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                          <span className="text-muted-foreground">
                            {t("statistics.heatmap.flashcards")}
                          </span>
                          <span className="text-foreground font-mono font-medium tabular-nums">
                            {cell.flashcards}
                          </span>
                        </div>
                      </div>
                    )}
                    {cell.translations > 0 && (
                      <div className="flex w-full items-center gap-2">
                        <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                          <span className="text-muted-foreground">
                            {t("statistics.heatmap.translations")}
                          </span>
                          <span className="text-foreground font-mono font-medium tabular-nums">
                            {cell.translations}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {t("statistics.heatmap.noActivity")}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </svg>
      </div>
    </div>
  );
};
