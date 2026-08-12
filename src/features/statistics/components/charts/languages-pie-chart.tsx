import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLanguages } from "@/features/languages/api/get-languages";
import { StatisticsContainer } from "@/features/statistics/components/statistics-container";
import { type UserStatistics } from "@/features/statistics/interfaces/user-statistics.interface";
import { useI18n } from "@/hooks/use-i18n";

type LanguagesPieChartProps = {
  stats: UserStatistics;
  className?: string;
};

const MIN_SLICE_SHARE = 0.05;

const SLICE_COLORS = [
  "var(--primary)",
  "var(--color-blue-500)",
  "var(--color-amber-500)",
  "var(--color-violet-500)",
  "var(--color-rose-500)",
];

const OTHER_COLOR = "var(--muted-foreground)";

export const LanguagesPieChart = ({
  stats,
  className,
}: LanguagesPieChartProps) => {
  const t = useI18n();
  const { getLanguageString } = useLanguages();

  const languages = useMemo(
    () => stats?.total?.languages ?? [],
    [stats?.total?.languages],
  );

  const totalTranslations = useMemo(
    () => languages.reduce((sum, l) => sum + (l.translationsCount ?? 0), 0),
    [languages],
  );

  const chartData = useMemo(() => {
    if (totalTranslations === 0) return [];

    const sorted = [...languages].sort(
      (a, b) => (b.translationsCount ?? 0) - (a.translationsCount ?? 0),
    );

    const major = sorted.filter(
      (l) =>
        (l.translationsCount ?? 0) / totalTranslations >= MIN_SLICE_SHARE ||
        sorted.length === 1,
    );
    const rest = sorted.filter((l) => !major.includes(l));

    const slices = major.slice(0, SLICE_COLORS.length).map((l, index) => ({
      key: `${l.languageId}`,
      label: getLanguageString(l.languageId) ?? "",
      value: l.translationsCount ?? 0,
      fill: SLICE_COLORS[index],
    }));

    const otherTotal = [...major.slice(SLICE_COLORS.length), ...rest].reduce(
      (sum, l) => sum + (l.translationsCount ?? 0),
      0,
    );

    if (otherTotal > 0) {
      slices.push({
        key: "other",
        label: t("statistics.other"),
        value: otherTotal,
        fill: OTHER_COLOR,
      });
    }

    return slices;
  }, [getLanguageString, languages, t, totalTranslations]);

  const chartConfig = useMemo(
    () =>
      ({
        ...Object.fromEntries(
          chartData.map((item) => [
            item.key,
            { color: item.fill, label: item.label },
          ]),
        ),
      }) satisfies ChartConfig,
    [chartData],
  );

  if (chartData.length === 0) return null;

  return (
    <StatisticsContainer
      className={className}
      title={t("statistics.yourLanguages")}
    >
      <div className="flex items-center gap-5">
        <ChartContainer className="aspect-square size-56" config={chartConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="key"
              innerRadius={66}
              outerRadius={105}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex-1 space-y-1.5 text-sm">
          {chartData.map((slice) => (
            <li key={slice.key} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: slice.fill }}
              />

              <span className="truncate">{slice.label}</span>

              <span className="text-muted-foreground ml-auto text-xs">
                {slice.value.toLocaleString()} ·{" "}
                {Math.round((slice.value / totalTranslations) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </StatisticsContainer>
  );
};
