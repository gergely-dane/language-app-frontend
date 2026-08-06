import { type Icon, IconLoader2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

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
