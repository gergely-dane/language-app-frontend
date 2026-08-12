"use client";

import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { useGetUser } from "@/features/user/api/get-user";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type UserButtonProps = {
  className?: string;
};

export const UserButton = ({ className }: UserButtonProps) => {
  const t = useI18n();
  const { logout } = useAuth();
  const { data: userProfile } = useGetUser();
  const [open, setOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout()
      .then(() => {
        window.location.href = "/login";
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  const displayName =
    userProfile?.firstName || userProfile?.lastName
      ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim()
      : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          aria-label={t("settings.account")}
        >
          <IconUser className="size-4.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-0" align="end">
        <div className="px-3.5 py-3">
          {displayName && (
            <p className="truncate text-sm font-semibold">{displayName}</p>
          )}

          <p className="text-muted-foreground truncate text-xs">
            {userProfile?.email}
          </p>
        </div>

        <Separator />

        <div className="p-1.5">
          <Link
            className="hover:bg-accent flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors"
            href="/settings"
            onClick={() => setOpen(false)}
          >
            <IconSettings className="text-muted-foreground size-4" />

            {t("settings.title")}
          </Link>

          <button
            className={cn(
              "text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
            )}
            onClick={handleLogout}
          >
            <IconLogout className="size-4" />

            {t("auth.logOut")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
