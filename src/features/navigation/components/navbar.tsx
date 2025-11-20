"use client";

import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/ui/theme-toggle-button";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback } from "react";
import { UserButton } from "./user-button";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();

  const handleThemeToggle = useCallback(() => {
    startTransition(() => {
      setTheme(theme === "light" ? "dark" : "light");
    });
  }, [startTransition, theme, setTheme]);

  return (
    <nav className="sticky top-0 flex w-full items-center gap-6 border-b px-2.5 py-3 shadow-sm z-10 bg-background/80">
      <Link className="text-xl text-primary font-semibold" href="/">
        LanguageApp
      </Link>

      <div className="flex gap-2.5 ml-auto">
        <ThemeToggleButton
          theme={theme as "light" | "dark"}
          onClick={handleThemeToggle}
          variant="circle-blur"
          start="center"
        />

        {isAuthenticated && <UserButton />}
      </div>
    </nav>
  );
};
