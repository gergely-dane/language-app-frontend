import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export const PageHeader = ({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3",
        className,
      )}
    >
      <div>
        <p className="text-3xl font-bold">{title}</p>

        {subtitle && (
          <p className="text-muted-foreground font-semibold">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
};
