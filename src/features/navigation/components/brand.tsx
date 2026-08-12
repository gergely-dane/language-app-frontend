import Link from "next/link";

import { cn } from "@/lib/utils";

export const Brand = ({ className }: { className?: string }) => {
  return (
    <Link
      className={cn("group inline-flex items-center gap-2.5", className)}
      href="/"
    >
      <span aria-hidden className="relative block h-6 w-8">
        <span className="bg-muted absolute inset-x-1 top-0 h-4.5 -rotate-6 rounded-[4px] border transition-transform group-hover:-rotate-10" />

        <span className="bg-card absolute inset-x-0.5 top-0.5 h-4.5 rotate-3 rounded-[4px] border transition-transform group-hover:rotate-6" />

        <span className="border-destructive/60 bg-background absolute inset-x-0 top-1 h-4.5 rounded-[4px] border shadow-sm">
          <span className="bg-destructive/70 absolute inset-y-0.5 left-1.5 w-px" />
        </span>
      </span>

      <span className="font-display text-[1.35rem] font-semibold tracking-tight">
        Kartei
      </span>
    </Link>
  );
};
