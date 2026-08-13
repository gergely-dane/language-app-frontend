import { cn } from "@/lib/utils";

export const SectionLabel = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h3
    className={cn(
      "text-muted-foreground font-sans text-xs font-medium tracking-widest uppercase",
      className,
    )}
  >
    {children}
  </h3>
);
