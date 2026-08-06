import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

  const chartConfig = {
    failedFlashcards: {
      label: t("statistics.answerBreakdown.again"),
      color: "oklch(0.65 0.15 25)",
    },
    wasntSureFlashcards: {
      label: t("statistics.answerBreakdown.hard"),
      color: "oklch(0.75 0.15 75)",
    },
    successfulFlashcards: {
      label: t("statistics.answerBreakdown.good"),
      color: "oklch(0.7 0.15 155)",
    },
    easyFlashcards: {
      label: t("statistics.answerBreakdown.easy"),
      color: "oklch(0.7 0.12 230)",
    },
  } satisfies ChartConfig;

  return (
    <StatisticsContainer
      className={className}
      title={t("statistics.flashcardsCompleted")}
      total={totalFlashcards}
      days={stats.daily.length}
    >
      <ChartContainer
        className="aspect-auto h-[200px] w-full lg:h-full"
        config={chartConfig}
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} horizontal={false} />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={28}
            tickFormatter={(value: Date) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
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

          <Bar
            dataKey="failedFlashcards"
            stackId="a"
            fill="var(--color-failedFlashcards)"
            radius={[0, 0, 4, 4]}
          />

          <Bar
            dataKey="wasntSureFlashcards"
            stackId="a"
            fill="var(--color-wasntSureFlashcards)"
            radius={0}
          />

          <Bar
            dataKey="successfulFlashcards"
            stackId="a"
            fill="var(--color-successfulFlashcards)"
            radius={0}
          />

          <Bar
            dataKey="easyFlashcards"
            stackId="a"
            fill="var(--color-easyFlashcards)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </StatisticsContainer>
  );
};
