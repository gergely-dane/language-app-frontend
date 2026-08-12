import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatisticsContainer } from "@/features/statistics/components/statistics-container";
import { type UserStatistics } from "@/features/statistics/interfaces/user-statistics.interface";
import { groupStatsByWeek } from "@/features/statistics/utils";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

type FlashcardsAddedBarChartProps = {
  stats: UserStatistics;
  className?: string;
};

const SERIES = [
  {
    key: "failedFlashcards",
    labelKey: "statistics.answerBreakdown.again",
    color: "var(--destructive)",
  },
  {
    key: "wasntSureFlashcards",
    labelKey: "statistics.answerBreakdown.hard",
    color: "var(--muted-foreground)",
  },
  {
    key: "successfulFlashcards",
    labelKey: "statistics.answerBreakdown.good",
    color: "var(--success)",
  },
  {
    key: "easyFlashcards",
    labelKey: "statistics.answerBreakdown.easy",
    color: "var(--color-amber-500)",
  },
] as const;

export const FlashcardsAddedBarChart = ({
  stats,
  className,
}: FlashcardsAddedBarChartProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const dailyData = stats?.daily ?? [];
  const shouldGroup =
    (isMobile && dailyData.length >= 90) ||
    (!isMobile && dailyData.length >= 365);
  const chartData = shouldGroup ? groupStatsByWeek(dailyData) : dailyData;

  const totalFlashcards = dailyData.reduce(
    (acc, day) =>
      acc +
      day.successfulFlashcards +
      day.easyFlashcards +
      day.failedFlashcards +
      day.wasntSureFlashcards,
    0,
  );

  const chartConfig = Object.fromEntries(
    SERIES.map((series) => [
      series.key,
      { label: t(series.labelKey), color: series.color },
    ]),
  ) satisfies ChartConfig;

  return (
    <StatisticsContainer
      className={className}
      title={t("statistics.flashcardsCompleted")}
      subtitle={t("statistics.totalInLastDays", {
        total: totalFlashcards.toLocaleString(),
        days: stats.daily.length,
      })}
      headerRight={
        <div className="flex flex-wrap items-center gap-3">
          {SERIES.map((series) => (
            <span
              key={series.key}
              className="text-muted-foreground flex items-center gap-1.5 text-xs"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ background: series.color }}
              />

              {t(series.labelKey)}
            </span>
          ))}
        </div>
      }
    >
      <ChartContainer
        className="aspect-auto h-[220px] w-full"
        config={chartConfig}
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 4, right: 0, left: -18, bottom: 0 }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tickMargin={8}
            minTickGap={28}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickFormatter={(value: Date) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value: Date, payload: any[]) => {
                  if (shouldGroup && payload?.[0]?.payload?.endDate) {
                    const startDate = new Date(value);
                    const endDate = new Date(
                      payload[0].payload.endDate as string,
                    );

                    const startYear = startDate.getFullYear();
                    const endYear = endDate.getFullYear();

                    const startStr = startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      ...(startYear !== endYear && { year: "numeric" }),
                    });

                    const endStr = endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return `${startStr} - ${endStr}`;
                  }

                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />

          {SERIES.map((series, index) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              stackId="a"
              fill={series.color}
              stroke="var(--card)"
              strokeWidth={1}
              maxBarSize={26}
              radius={index === SERIES.length - 1 ? [3, 3, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </StatisticsContainer>
  );
};
