import { cn } from "@/lib/utils";

type StatisticsContainerProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
};

export const StatisticsContainer = ({
  className,
  title,
  subtitle,
  headerRight,
  children,
}: StatisticsContainerProps) => {
  return (
    <div
      className={cn(
        "bg-card flex flex-col gap-4 overflow-hidden rounded-lg border p-4 shadow-sm",
        className,
      )}
    >
      {(title || headerRight) && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <div>
            {title && <h2 className="text-base">{title}</h2>}

            {subtitle && (
              <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
            )}
          </div>

          {headerRight}
        </div>
      )}

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};
