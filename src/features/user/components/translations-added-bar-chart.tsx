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

type TranslationsAddedChartProps = {
  stats: UserStatistics;
  className?: string;
};

export const TranslationsAddedBarChart = ({
  stats,
  className,
}: TranslationsAddedChartProps) => {
  const t = useI18n();

  const totalWords = stats.daily.reduce(
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
      total={totalWords}
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
                nameKey="newTranslationsAdded"
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
            dataKey="newTranslationsAdded"
            fill="var(--primary)"
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ChartContainer>
    </StatisticsContainer>
  );
};
