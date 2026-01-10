import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useI18n } from "@/hooks/use-i18n";
import { UserStatistics } from "@/interfaces/user-statistics.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";
import { Pie, PieChart } from "recharts";

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

  const languagePairs = stats?.total?.languagePairs ?? [];

  const totalTranslations = languagePairs.reduce(
    (sum, lp) => sum + (lp.translationsCount ?? 0),
    0,
  );

  const visible: LanguageSlice[] = [];
  const other: LanguageSlice[] = [];
  for (const lp of languagePairs) {
    const translationsCount = lp.translationsCount ?? 0;
    const share = totalTranslations ? translationsCount / totalTranslations : 0;
    const source = getLanguage(lp.sourceLanguageId)?.code ?? "";
    const target = getLanguage(lp.translationLanguageId)?.code ?? "";

    (share >= MIN_SLICE_SHARE ? visible : other).push({
      key: `${lp.sourceLanguageId}-${lp.translationLanguageId}`,
      label: `${LANGUAGES[source]} -> ${LANGUAGES[target]}`,
      translationsCount,
      share,
    });
  }

  const finalItems = other.length === 1 ? [...visible, other[0]] : visible;
  const slicesCount = finalItems.length + (other.length > 1 ? 1 : 0);

  const getSliceColor = (index: number) => {
    if (slicesCount <= 1) return "var(--primary)";
    const t = index / (slicesCount - 1);
    return `oklch(from var(--primary) calc(l + ${t} * 0.12) c h)`;
  };

  const chartData = [
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
  ];

  const chartConfig = {
    translations: { label: t("general.translations") },
    ...Object.fromEntries(
      chartData.map((item) => [item.key, { color: item.fill }]),
    ),
  } satisfies ChartConfig;

  return (
    <ChartContainer
      className={cn(
        "flex flex-col justify-center bg-card rounded-lg border shadow-sm",
        className,
      )}
      config={chartConfig}
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="translationsCount"
          nameKey="label"
          label={({ x, y, textAnchor, dominantBaseline, name, fill }) => (
            <text
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline={dominantBaseline}
              style={{ fontWeight: 600 }}
              fill={fill}
            >
              {name}
            </text>
          )}
        />
      </PieChart>
    </ChartContainer>
  );
};
