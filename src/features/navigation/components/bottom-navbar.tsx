"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";
import { IconCards, IconHome, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNavbar = () => {
  const t = useI18n();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobileScreen();

  return (
    <nav
      className={cn(
        "fixed bottom-0 flex flex-cols gap-4 py-1.5 px-2 bg-muted w-full shadow-sm h-16 z-10 text-muted-foreground border-t",
        {
          hidden: !isMobile || !isAuthenticated,
        },
      )}
    >
      <Link href="/" className="flex-1">
        <Button
          variant="ghost"
          className={cn("flex flex-col w-full h-full gap-0.5 bg-muted", {
            "bg-primary text-white": pathname === "/",
          })}
        >
          <IconHome className="scale-130" />
          <p className="text-xs">{t("general.home")}</p>
        </Button>
      </Link>

      <Link href="/vocabulary" className="flex-1">
        <Button
          variant="ghost"
          className={cn("flex flex-col w-full h-full gap-0.5 bg-muted", {
            "bg-primary text-white": pathname === "/vocabulary",
          })}
        >
          <IconList className="scale-130" />
          <p className="text-xs">{t("general.vocabulary")}</p>
        </Button>
      </Link>

      <Link href="/flashcards" className="flex-1">
        <Button
          variant="ghost"
          className={cn("flex flex-col w-full h-full gap-0.5 bg-muted", {
            "bg-primary text-white": pathname === "/flashcards",
          })}
        >
          <IconCards className="scale-130" />
          <p className="text-xs">{t("general.flashcards")}</p>
        </Button>
      </Link>
    </nav>
  );
};
