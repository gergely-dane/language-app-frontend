import { IconLogout, IconUser } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

type UserButtonProps = {
  className?: string;
};

export const UserButton = ({ className }: UserButtonProps) => {
  const t = useI18n();
  const { user, logout } = useAuth();

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
        <div className="flex items-center gap-1 px-2.5">
          <IconUser size={16} />
          <p className="text-muted-foreground text-xs">{user?.email}</p>
        </div>

        <Separator />

        <Button
          variant="ghost"
          className="justify-start"
          onClick={handleLogout}
        >
          <IconLogout />
          {t("auth.logOut")}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
