"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type BottomNavbarButtonProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
};

export const BottomNavbarButton = ({
  href,
  icon: Icon,
  label,
  isActive,
}: BottomNavbarButtonProps) => {
  return (
    <Link href={href} className="flex-1">
      <Button
        variant="ghost"
        className={cn(
          "bg-accent flex h-full w-full flex-col gap-0.5 transition-colors duration-500",
          {
            "bg-primary text-white": isActive,
          },
        )}
      >
        <Icon className="scale-130" />
        <p className="text-xs">{label}</p>
      </Button>
    </Link>
  );
};
