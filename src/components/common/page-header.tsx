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
        <h1 className="text-3xl">{title}</h1>

        {subtitle && (
          <p className="text-muted-foreground font-semibold">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
};
