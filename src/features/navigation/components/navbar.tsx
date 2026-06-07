"use client";

import { IconCards, IconHome, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/ui/theme-toggle-button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

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

  return (
    <nav className="bg-background/80 sticky top-0 z-10 flex h-[var(--navbar-height)] w-full items-center justify-center gap-6 border-b shadow-sm">
      <div className="flex w-full items-center gap-6 px-2.5 xl:max-w-9/10 2xl:max-w-5/7">
        <Link className="text-primary text-xl font-semibold" href="/">
          LanguageApp
        </Link>

        {!isMobile && isAuthenticated && (
          <>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant={pathname === "/" ? "default" : "ghost"}>
                  <IconHome className="scale-120" />
                  <p>{t("general.home")}</p>
                </Button>
              </Link>

              <Link href="/vocabulary">
                <Button
                  variant={pathname === "/vocabulary" ? "default" : "ghost"}
                >
                  <IconList className="scale-120" />
                  <p>{t("general.vocabulary")}</p>
                </Button>
              </Link>

              <Link href="/flashcards">
                <Button
                  variant={pathname === "/flashcards" ? "default" : "ghost"}
                >
                  <IconCards className="scale-120" />
                  <p>{t("general.flashcards")}</p>
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className="ml-auto flex gap-2.5">
          <ThemeToggleButton
            theme={theme as "light" | "dark"}
            onClick={handleThemeToggle}
            variant="circle-blur"
            start="center"
          />
          {isAuthenticated && <UserButton />}
        </div>
      </div>
    </nav>
  );
};
