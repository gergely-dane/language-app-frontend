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
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type UserButtonProps = {
  className?: string;
};

export const UserButton = ({ className }: UserButtonProps) => {
  const t = useI18n();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout().then(() => router.push("/login"));
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
        className="flex flex-col w-fit gap-2 pt-2 pb-1 px-1"
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
