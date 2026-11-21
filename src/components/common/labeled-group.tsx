import { useId } from "react";

import { cn } from "@/lib/utils";

type LabeledGroupProps = {
  className?: string;
  label: string;
  children: React.ReactNode;
};

export const LabeledGroup = ({
  className,
  label,
  children,
}: LabeledGroupProps) => {
  const labelId = useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <span id={labelId} className="text-muted-foreground text-xs font-medium">
        {label}
      </span>

      {children}
    </div>
  );
};
