"use client";

import { type TablerIcon } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BottomNavbarButtonProps = {
  href: string;
  icon: TablerIcon;
  label: string;
  isActive: boolean;
  badge?: number;
  className?: string;
};

export const BottomNavbarButton = ({
  href,
  icon: Icon,
  label,
  isActive,
  badge = 0,
  className,
}: BottomNavbarButtonProps) => {
  return (
    <Link href={href} className="flex-1">
      <Button
        variant="ghost"
        rippleClassName={cn(isActive && "bg-primary-foreground/40")}
        className={cn(
          "flex h-full w-full rounded-md px-1 transition-colors duration-500",
          isActive
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            : "text-muted-foreground",
          className,
        )}
      >
        <span className="flex flex-col items-center gap-0.5 text-[11px] font-medium">
          <Icon className="size-5" strokeWidth={isActive ? 2.25 : 2} />

          {label}

          {badge > 0 && (
            <span
              className={cn(
                "absolute top-0.5 right-0.5 rounded-full px-1.5 py-px text-[10px] leading-4",
                isActive
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
      </Button>
    </Link>
  );
};
