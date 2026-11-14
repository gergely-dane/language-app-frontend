import { useId } from "react";

import { cn } from "@/lib/utils";

type DeckSettingProps = {
  className?: string;
  label: string;
  children: React.ReactNode;
};

export const DeckSetting = ({
  className,
  label,
  children,
}: DeckSettingProps) => {
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
