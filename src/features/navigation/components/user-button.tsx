import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";

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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("rounded-full shadow-sm", className)}
        >
          <IconUser className="text-primary" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="flex w-fit flex-col gap-2 px-1 pt-2 pb-1"
        align="end"
      >
        <div className="flex flex-col gap-0.5 px-2.5">
          {displayName && <p className="text-sm font-medium">{displayName}</p>}
          <p className="text-muted-foreground text-xs">{userProfile?.email}</p>
        </div>

        <Separator />

        <div className="gap-1">
          <Button variant="ghost" className="w-full justify-start px-2.5">
            <Link href="/settings" className="flex w-full items-center gap-2">
              <IconSettings />
              <span className="mb-0.5">{t("settings.title")}</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="text-destructive w-full items-center justify-start"
            onClick={handleLogout}
          >
            <IconLogout />
            <span className="mb-0.5">{t("auth.logOut")}</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
