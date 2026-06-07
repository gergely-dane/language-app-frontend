import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

type StatisticsContainerProps = {
  className?: string;
  title?: string;
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
        "bg-card flex flex-col justify-center gap-4 overflow-hidden rounded-lg border p-4 shadow-sm lg:h-auto lg:flex-row",
        className,
      )}
    >
      <div className="h-full">
        {title && <p className="text-sm font-semibold text-nowrap">{title}</p>}

        {total && (
          <div className="flex items-center gap-2 lg:flex-col lg:items-start lg:gap-0">
            <p className="mt-1 text-3xl font-bold">{total}</p>

            {days && (
              <p className="text-muted-foreground text-sm text-nowrap">
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
