"use client";

import { Button } from "@/components/ui/button";
import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/ui/theme-toggle-button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { IconCards, IconHome, IconList } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
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
    <nav className="sticky top-0 flex w-full items-center justify-center gap-6 border-b h-[var(--navbar-height)] shadow-sm z-10 bg-background/80">
      <div className="flex px-2.5 w-full lg:w-3/5 gap-6">
        <Link className="text-xl text-primary font-semibold" href="/">
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

        <div className="flex gap-2.5 ml-auto">
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
