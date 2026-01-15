import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

type StatisticsContainerProps = {
  className?: string;
  title: string;
  total?: number;
  days?: number;
  children: React.ReactNode;
};

export const StatisticsContainer = ({
  className,
  title,
  total,
  days,
  children,
}: StatisticsContainerProps) => {
  const t = useI18n();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 justify-center p-4 bg-card rounded-lg border shadow-sm lg:flex-row",
        className,
      )}
    >
      <div>
        <p className="text-sm font-semibold text-nowrap">{title}</p>
        {total && (
          <div className="flex items-center gap-2 lg:flex-col lg:items-start lg:gap-0">
            <p className="text-3xl font-bold mt-1">{total}</p>
            {days && (
              <p className="text-sm text-muted-foreground text-nowrap">
                {t("statistics.inTheLastXDays", { days })}
              </p>
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
