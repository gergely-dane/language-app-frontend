"use client";

import {
  IconCards,
  IconChartBar,
  IconHome,
  IconVocabulary,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import { useUserStatistics } from "@/features/statistics/api/get-user-statistics";
import { useI18n } from "@/hooks/use-i18n";

import { BottomNavbarButton } from "./bottom-navbar-button";

export const BottomNavbar = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  return <BottomNavbarContent pathname={pathname} />;
};

const BottomNavbarContent = ({ pathname }: { pathname: string }) => {
  const t = useI18n();

  const { data: stats } = useUserStatistics({ previousDays: 30 });
  const dueCount = stats?.today?.dueFlashcards ?? 0;

  return (
    <nav
      className="bg-background/95 fixed bottom-0 z-10 flex h-16 w-full items-stretch gap-2 border-t px-2 py-1.5 shadow-sm backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.375rem)" }}
    >
      <BottomNavbarButton
        href="/"
        icon={IconHome}
        label={t("general.home")}
        isActive={pathname === "/"}
      />

      <BottomNavbarButton
        href="/vocabulary"
        icon={IconVocabulary}
        label={t("general.vocabulary")}
        isActive={pathname === "/vocabulary"}
      />

      <BottomNavbarButton
        href="/flashcards"
        icon={IconCards}
        label={t("general.flashcards")}
        isActive={pathname === "/flashcards"}
        badge={dueCount}
      />

      <BottomNavbarButton
        href="/statistics"
        icon={IconChartBar}
        label={t("general.statistics")}
        isActive={pathname === "/statistics"}
      />
    </nav>
  );
};
