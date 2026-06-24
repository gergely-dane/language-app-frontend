"use client";

import { IconCards, IconHome, IconList } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

import { BottomNavbarButton } from "./bottom-navbar-button";

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
      <BottomNavbarButton
        href="/"
        icon={IconHome}
        label={t("general.home")}
        isActive={pathname === "/"}
      />

      <BottomNavbarButton
        href="/vocabulary"
        icon={IconList}
        label={t("general.vocabulary")}
        isActive={pathname === "/vocabulary"}
      />

      <BottomNavbarButton
        href="/flashcards"
        icon={IconCards}
        label={t("general.flashcards")}
        isActive={pathname === "/flashcards"}
      />
    </nav>
  );
};
