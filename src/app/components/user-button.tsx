import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { IconLogout, IconUser } from "@tabler/icons-react";

interface UserButtonProps {
  className?: string;
}

export const UserButton = ({ className }: UserButtonProps) => {
  const t = useI18n();
  const { user, logout } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("bg-white rounded-full", className)}
        >
          <IconUser />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="flex flex-col w-fit gap-2 py-1 px-1.5"
        align="end"
      >
        <div className="text-muted-foreground text-sm">{user?.email}</div>
        <Separator />
        <Button variant="ghost" className="justify-start" onClick={logout}>
          <IconLogout />
          {t("general.logOut")}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
