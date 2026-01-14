import { cn } from "@/utils/cn";
import { Icon, IconLoader2 } from "@tabler/icons-react";

function Spinner({ className, ...props }: React.ComponentProps<Icon>) {
  return (
    <IconLoader2
      role="status"
      aria-label="Loading"
      className={cn("text-primary size-8 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
