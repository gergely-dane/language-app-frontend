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

type FlashcardsAddedLineChartProps = {
  stats: UserStatistics;
  className?: string;
};

export const FlashcardsAddedLineChart = ({
  stats,
  className,
}: FlashcardsAddedLineChartProps) => {
  const t = useI18n();

  const chartConfig = {
    failedFlashcards: {
      label: t("statistics.didntKnow"),
    },
    successfulFlashcards: {
      label: t("statistics.knew"),
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
  );
};
