"use client";

import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/common/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

import { Brand } from "./brand";
import { UserButton } from "./user-button";

export const Navbar = () => {
  const t = useI18n();
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const isMobile = useIsMobileScreen();
  const pathname = usePathname();

  const handleThemeToggle = useCallback(() => {
    startTransition(() => {
      setTheme(theme === "light" ? "dark" : "light");
    });
  }, [startTransition, theme, setTheme]);

  if (!isMobile && isAuthenticated && pathname !== "/login") return null;

  return (
    <nav className="bg-background/80 sticky top-0 z-10 flex h-[var(--navbar-height)] w-full items-center justify-center gap-6 border-b shadow-sm">
      <div className="flex w-full items-center gap-6 px-2.5 xl:max-w-9/10 2xl:max-w-5/7">
        <Brand />

        <div className="ml-auto flex gap-1">
          <ThemeToggleButton
            theme={theme as "light" | "dark"}
            onClick={handleThemeToggle}
            variant="circle-blur"
            start="center"
          />

          {isAuthenticated && (
            <>
              <Link href="/settings">
                <Button
                  aria-label={t("settings.title")}
                  size="icon"
                  variant="ghost"
                >
                  <IconSettings className="scale-130" />
                </Button>
              </Link>

              <UserButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
