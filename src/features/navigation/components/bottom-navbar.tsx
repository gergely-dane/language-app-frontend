"use client";

import { IconCards, IconHome, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

export const BottomNavbar = () => {
  const t = useI18n();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobileScreen();

  if (!isMobile || !isAuthenticated || pathname === "/login") {
    return null;
  }

  return (
    <nav className="flex-cols bg-accent text-muted-foreground fixed bottom-0 z-10 flex h-16 w-full gap-4 border-t px-2 py-1.5 shadow-sm">
      <Link href="/" className="flex-1">
        <Button
          variant="ghost"
          className={cn("bg-accent flex h-full w-full flex-col gap-0.5", {
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
          className={cn("bg-accent flex h-full w-full flex-col gap-0.5", {
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
          className={cn("bg-accent flex h-full w-full flex-col gap-0.5", {
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
