"use client";

import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatisticsContainer } from "@/features/statistics/components/statistics-container";
import { type UserStatistics } from "@/features/statistics/types";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";

type CardStatePieChartProps = {
  stats: UserStatistics;
  className?: string;
};

const STATE_COLORS = {
  new: "var(--primary)",
  learning: "var(--color-amber-500)",
  review: "var(--success)",
  relearning: "var(--color-violet-500)",
} as const;

export const CardStatePieChart = ({
  stats,
  className,
}: CardStatePieChartProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const breakdown = stats.cardBreakdown;

  const chartData = useMemo(() => {
    if (!breakdown) return [];
    return [
      {
        name: t("statistics.cardBreakdown.new"),
        value: breakdown.newCards,
        fill: STATE_COLORS.new,
      },
      {
        name: t("statistics.cardBreakdown.learning"),
        value: breakdown.learningCards,
        fill: STATE_COLORS.learning,
      },
      {
        name: t("statistics.cardBreakdown.review"),
        value: breakdown.reviewCards,
        fill: STATE_COLORS.review,
      },
      {
        name: t("statistics.cardBreakdown.relearning"),
        value: breakdown.relearningCards,
        fill: STATE_COLORS.relearning,
      },
    ].filter((d) => d.value > 0);
  }, [breakdown, t]);

  const totalCards = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData],
  );

  const chartConfig = {
    new: { label: t("statistics.cardBreakdown.new"), color: STATE_COLORS.new },
    learning: {
      label: t("statistics.cardBreakdown.learning"),
      color: STATE_COLORS.learning,
    },
    review: {
      label: t("statistics.cardBreakdown.review"),
      color: STATE_COLORS.review,
    },
    relearning: {
      label: t("statistics.cardBreakdown.relearning"),
      color: STATE_COLORS.relearning,
    },
  } satisfies ChartConfig;

  if (!breakdown || totalCards === 0) return null;

  return (
    <StatisticsContainer
      className={className}
      title={t("statistics.cardBreakdown.title")}
    >
      <div className="flex items-center gap-5">
        <ChartContainer
          className={cn("aspect-square", isMobile ? "size-37" : "size-56")}
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={isMobile ? 44 : 66}
              outerRadius={isMobile ? 70 : 105}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={cn(
                            "fill-foreground font-mono font-medium",
                            isMobile ? "text-lg" : "text-2xl",
                          )}
                        >
                          {totalCards.toLocaleString()}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + (isMobile ? 17 : 22)}
                          className="fill-muted-foreground text-xs"
                        >
                          {t("statistics.cardBreakdown.totalCards")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex-1 space-y-1.5 text-sm">
          {chartData.map((slice) => (
            <li key={slice.name} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: slice.fill }}
              />

              <span className="truncate">{slice.name}</span>

              <span className="text-muted-foreground ml-auto text-xs">
                {slice.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </StatisticsContainer>
  );
};
