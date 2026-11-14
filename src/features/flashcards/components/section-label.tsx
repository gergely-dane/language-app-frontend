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
      "text-muted-foreground font-sans text-xs font-semibold tracking-widest uppercase lg:text-[13px]/4",
      className,
    )}
  >
    {children}
  </h3>
);
