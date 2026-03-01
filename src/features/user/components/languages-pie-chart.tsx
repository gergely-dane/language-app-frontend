import { useCallback, useMemo } from "react";
import { Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLanguages } from "@/features/languages/api/get-languages";
import { StatisticsContainer } from "@/features/user/components/statistics-container";
import { useI18n } from "@/hooks/use-i18n";
import { type UserStatistics } from "@/interfaces/user-statistics.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";

type LanguagesPieChartProps = {
  stats: UserStatistics;
  className?: string;
};

interface LanguageSlice {
  key: string;
  label: string;
  translationsCount: number;
  share: number;
  fill?: string;
}

const MIN_SLICE_SHARE = 0.05;

export const LanguagesPieChart = ({
  stats,
  className,
}: LanguagesPieChartProps) => {
  const t = useI18n();
  const { getLanguage } = useLanguages();

  const languagePairs = useMemo(
    () => stats?.total?.languagePairs ?? [],
    [stats?.total?.languagePairs],
  );

  const totalTranslations = useMemo(
    () =>
      languagePairs.reduce((sum, lp) => sum + (lp.translationsCount ?? 0), 0),
    [languagePairs],
  );

  const { visible, other } = useMemo(() => {
    const visible: LanguageSlice[] = [];
    const other: LanguageSlice[] = [];

    for (const lp of languagePairs) {
      const translationsCount = lp.translationsCount ?? 0;
      const share = totalTranslations
        ? translationsCount / totalTranslations
        : 0;
      const source = getLanguage(lp.sourceLanguageId)?.code ?? "";
      const target = getLanguage(lp.translationLanguageId)?.code ?? "";

      (share >= MIN_SLICE_SHARE ? visible : other).push({
        key: `${lp.sourceLanguageId}-${lp.translationLanguageId}`,
        label: `${LANGUAGES[source]} -> ${LANGUAGES[target]}`,
        translationsCount,
        share,
      });
    }

    return { visible, other };
  }, [getLanguage, languagePairs, totalTranslations]);

  const finalItems = useMemo(
    () => (other.length === 1 ? [...visible, other[0]] : visible),
    [other, visible],
  );

  const slicesCount = finalItems.length + (other.length > 1 ? 1 : 0);

  const getSliceColor = useCallback(
    (index: number) => {
      if (slicesCount <= 1) return "var(--primary)";
      const t = index / (slicesCount - 1);
      return `oklch(from var(--primary) calc(l + ${t} * 0.12) c h)`;
    },
    [slicesCount],
  );

  const chartData = useMemo(
    () => [
      ...finalItems.map((item, index) => ({
        ...item,
        fill: getSliceColor(index),
      })),
      ...(other.length > 1
        ? [
            {
              key: "other",
              label: t("statistics.other"),
              translationsCount: other.reduce(
                (s, i) => s + i.translationsCount,
                0,
              ),
              share: other.reduce((s, i) => s + i.share, 0),
              fill: getSliceColor(slicesCount - 1),
            },
          ]
        : []),
    ],
    [finalItems, getSliceColor, other, slicesCount, t],
  );

  const chartConfig = useMemo(
    () =>
      ({
        translations: { label: t("general.translations") },
        ...Object.fromEntries(
          chartData.map((item) => [item.key, { color: item.fill }]),
        ),
      }) satisfies ChartConfig,
    [chartData, t],
  );

  return (
    <StatisticsContainer
      className={cn("w-full", className)}
      title={t("statistics.yourLanguages")}
    >
      <ChartContainer className="aspect-square w-full" config={chartConfig}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />

          <Pie
            data={chartData}
            dataKey="translationsCount"
            nameKey="label"
            // label={({ x, y, textAnchor, dominantBaseline, name, fill }) => (
            //   <text
            //     x={x}
            //     y={y}
            //     textAnchor={textAnchor}
            //     dominantBaseline={dominantBaseline}
            //     style={{ fontWeight: 600 }}
            //     fill={fill}
            //   >
            //     {name}
            //   </text>
            // )}
          />
        </PieChart>
      </ChartContainer>
    </StatisticsContainer>
  );
};
