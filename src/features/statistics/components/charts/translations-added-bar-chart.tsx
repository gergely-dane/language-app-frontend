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

type TranslationsAddedChartProps = {
  stats: UserStatistics;
  className?: string;
};

export const TranslationsAddedBarChart = ({
  stats,
  className,
}: TranslationsAddedChartProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const dailyData = stats?.daily ?? [];
  const shouldGroup =
    (isMobile && dailyData.length >= 90) ||
    (!isMobile && dailyData.length >= 365);
  const chartData = shouldGroup ? groupStatsByWeek(dailyData) : dailyData;

  const totalWords = dailyData.reduce(
    (acc, day) => acc + day.newTranslationsAdded,
    0,
  );

  const chartConfig = {
    newTranslationsAdded: {
      label: t("statistics.translationsAdded"),
    },
  } satisfies ChartConfig;

  return (
    <StatisticsContainer
      className={className}
      title={t("statistics.newWords")}
      subtitle={t("statistics.totalInLastDays", {
        total: totalWords.toLocaleString(),
        days: stats.daily.length,
      })}
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
                nameKey="newTranslationsAdded"
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
            dataKey="newTranslationsAdded"
            fill="var(--primary)"
            maxBarSize={26}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </StatisticsContainer>
  );
};
