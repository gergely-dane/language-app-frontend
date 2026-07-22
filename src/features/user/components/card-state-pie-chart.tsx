"use client";

import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatisticsContainer } from "@/features/user/components/statistics-container";
import { type UserStatistics } from "@/features/user/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

type CardStatePieChartProps = {
  stats: UserStatistics;
  className?: string;
};

export const CardStatePieChart = ({
  stats,
  className,
}: CardStatePieChartProps) => {
  const t = useI18n();
  const breakdown = stats.cardBreakdown;

  const chartData = useMemo(() => {
    if (!breakdown) return [];
    return [
      {
        name: t("statistics.cardBreakdown.new"),
        value: breakdown.newCards,
        fill: "var(--color-new)",
      },
      {
        name: t("statistics.cardBreakdown.learning"),
        value: breakdown.learningCards,
        fill: "var(--color-learning)",
      },
      {
        name: t("statistics.cardBreakdown.review"),
        value: breakdown.reviewCards,
        fill: "var(--color-review)",
      },
      {
        name: t("statistics.cardBreakdown.relearning"),
        value: breakdown.relearningCards,
        fill: "var(--color-relearning)",
      },
    ].filter((d) => d.value > 0);
  }, [breakdown, t]);

  const totalCards = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData],
  );

  const chartConfig = {
    new: { label: t("statistics.cardBreakdown.new"), color: "var(--primary)" },
    learning: {
      label: t("statistics.cardBreakdown.learning"),
      color: "oklch(from var(--primary) calc(l + 0.08) c h)",
    },
    review: {
      label: t("statistics.cardBreakdown.review"),
      color: "oklch(from var(--primary) calc(l + 0.16) c h)",
    },
    relearning: {
      label: t("statistics.cardBreakdown.relearning"),
      color: "oklch(from var(--primary) calc(l + 0.24) c h)",
    },
  } satisfies ChartConfig;

  if (!breakdown || totalCards === 0) return null;

  return (
    <StatisticsContainer
      className={cn("relative h-[400px] lg:h-auto lg:flex-col", className)}
      title={t("statistics.cardBreakdown.title")}
    >
      <ChartContainer
        className="absolute inset-0 aspect-square size-full min-w-0 lg:mt-4"
        config={chartConfig}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            strokeWidth={2}
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
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalCards}
                      </tspan>

                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
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
    </StatisticsContainer>
  );
};
