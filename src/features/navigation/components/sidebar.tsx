"use client";

import {
  IconCards,
  IconChartBar,
  IconHome,
  IconPlus,
  IconSettings,
  IconVocabulary,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/common/theme-toggle-button";
import { Kbd } from "@/components/ui/kbd";
import { useAuth } from "@/context/auth-context";
import { useUserStatistics } from "@/features/statistics/api/get-user-statistics";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit/add-edit-word-dialog";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

import { Brand } from "./brand";
import { UserButton } from "./user-button";

const NAV_ITEMS = [
  { href: "/", labelKey: "general.home", icon: IconHome },
  { href: "/vocabulary", labelKey: "general.vocabulary", icon: IconVocabulary },
  { href: "/flashcards", labelKey: "general.flashcards", icon: IconCards },
  { href: "/statistics", labelKey: "general.statistics", icon: IconChartBar },
] as const;

export const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated || pathname === "/login") return null;

  return <SidebarContent pathname={pathname} />;
};

const SidebarContent = ({ pathname }: { pathname: string }) => {
  const t = useI18n();
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const [addWordOpen, setAddWordOpen] = useState(false);

  const { data: stats } = useUserStatistics({ previousDays: 30 });
  const dueCount = stats?.today?.dueFlashcards ?? 0;

  const handleThemeToggle = useCallback(() => {
    startTransition(() => {
      setTheme(theme === "light" ? "dark" : "light");
    });
  }, [startTransition, theme, setTheme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "a") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const target = event.target as HTMLElement;
      if (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
        return;

      if (document.querySelector('[role="dialog"], [role="alertdialog"]'))
        return;

      event.preventDefault();
      setAddWordOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <aside className="bg-card sticky top-0 z-10 hidden h-dvh w-60 shrink-0 flex-col border-r shadow-sm lg:flex">
      <div className="px-5 pt-5 pb-2">
        <Brand />
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="size-4.5" />

              <span className="flex-1">{t(item.labelKey)}</span>

              {item.href === "/flashcards" && dueCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {dueCount}
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <IconSettings className="size-4.5" />

          <span className="flex-1">{t("settings.title")}</span>
        </Link>
      </nav>

      <div className="px-3 pb-3">
        <button
          onClick={() => setAddWordOpen(true)}
          className="text-muted-foreground hover:border-primary hover:text-primary flex w-full cursor-pointer items-center gap-3 rounded-md border border-dashed px-3 py-2 text-sm font-medium transition-colors"
        >
          <IconPlus className="size-4.5" />

          {t("vocabulary.addWord")}

          <Kbd className="ml-auto">A</Kbd>
        </button>
      </div>

      <div className="flex items-center justify-between border-t px-3 py-2.5">
        <ThemeToggleButton
          theme={theme as "light" | "dark"}
          onClick={handleThemeToggle}
          variant="circle-blur"
          start="center"
        />

        <UserButton />
      </div>

      <AddEditWordDialog open={addWordOpen} onOpenChange={setAddWordOpen} />
    </aside>
  );
};
