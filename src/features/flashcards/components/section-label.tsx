import { cn } from "@/lib/utils";

export const SectionLabel = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <p
    className={cn(
      "text-muted-foreground text-xs font-medium tracking-widest uppercase",
      className,
    )}
  >
    {children}
  </p>
);
