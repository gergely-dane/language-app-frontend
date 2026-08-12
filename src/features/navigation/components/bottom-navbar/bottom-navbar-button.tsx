"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BottomNavbarButtonProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  className?: string;
  iconClassName?: string;
};

export const BottomNavbarButton = ({
  href,
  icon: Icon,
  label,
  isActive,
  className,
  iconClassName,
}: BottomNavbarButtonProps) => {
  return (
    <Link href={href} className="flex-1">
      <Button
        variant="ghost"
        className={cn(
          "bg-accent flex h-full w-full flex-col gap-1.5 transition-colors duration-500",
          {
            "bg-primary text-white": isActive,
          },
          className,
        )}
      >
        <Icon className={cn("scale-120", iconClassName)} />
        <p className={isActive ? "font-semibold" : "font-medium"}>{label}</p>
      </Button>
    </Link>
  );
};
