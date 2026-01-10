import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useI18n } from "@/hooks/use-i18n";
import { UserStatistics } from "@/interfaces/user-statistics.interface";
import { cn } from "@/utils/cn";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type TranslationsAddedChartProps = {
  stats: UserStatistics;
  className?: string;
};

export const TranslationsAddedBarChart = ({
  stats,
  className,
}: TranslationsAddedChartProps) => {
  const t = useI18n();

  const chartConfig = {
    newTranslationsAdded: {
      label: t("statistics.translationsAdded"),
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      className={cn(
        "flex flex-col justify-center p-8 bg-card rounded-lg border shadow-sm",
        className,
      )}
      config={chartConfig}
    >
      <BarChart accessibilityLayer data={stats?.daily ?? []}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="newTranslationsAdded"
              labelFormatter={(value) => {
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
          radius={[4, 4, 4, 4]}
        />
      </BarChart>
    </ChartContainer>
  );
};
