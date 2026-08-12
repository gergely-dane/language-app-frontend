import { cn } from "@/lib/utils";

type StatisticsContainerProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  /** Rendered on the right side of the header, e.g. a chart legend. */
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
            {title && <p className="text-sm font-semibold">{title}</p>}

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
