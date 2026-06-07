import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatisticsContainer } from "@/features/user/components/statistics-container";
import { type UserStatistics } from "@/features/user/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";

type FlashcardsAddedLineChartProps = {
  stats: UserStatistics;
  className?: string;
};

export const FlashcardsAddedBarChart = ({
  stats,
  className,
}: FlashcardsAddedLineChartProps) => {
  const t = useI18n();

  const totalFlashcards = stats.daily.reduce(
    (acc, day) => acc + day.successfulFlashcards + day.failedFlashcards,
    0,
  );

  const chartConfig = {
    failedFlashcards: {
      label: t("statistics.didntKnow"),
    },
    successfulFlashcards: {
      label: t("statistics.knew"),
    },
  } satisfies ChartConfig;

  return (
    <StatisticsContainer
      className={className}
      title={t("statistics.flashcardsCompleted")}
      total={totalFlashcards}
      days={stats.daily.length}
    >
      <ChartContainer className="w-full" config={chartConfig}>
        <BarChart accessibilityLayer data={stats?.daily ?? []}>
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
                labelFormatter={(value: Date) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            }
          />

          <Bar
            dataKey="successfulFlashcards"
            stackId="a"
            fill="var(--color-primary)"
            radius={[0, 0, 4, 4]}
          />

          <Bar
            dataKey="failedFlashcards"
            stackId="a"
            fill="var(--primary-muted)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </StatisticsContainer>
  );
};
