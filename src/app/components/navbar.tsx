"use client";

import { UserButton } from "@/app/components/user-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import {
  IconCards,
  IconHome,
  IconLanguage,
  IconList,
} from "@tabler/icons-react";
import Link from "next/link";

export function Navbar() {
  const t = useI18n();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-muted-foreground/50 flex w-full items-center justify-center gap-6 border-b px-6 py-3 shadow-sm">
      <Link className="text-xl font-semibold" href="/">
        LanguageApp
      </Link>

      <div className="flex gap-3">
        <Link href="/">
          <Button variant="ghost">
            <IconHome />
            <span className="hidden lg:block">{t("general.home")}</span>
          </Button>
        </Link>

        <Link href="/vocabulary">
          <Button variant="ghost">
            <IconList />
            <span className="hidden lg:block">{t("general.vocabulary")}</span>
          </Button>
        </Link>

        <Link href="/flashcards">
          <Button variant="ghost">
            <IconCards />
            <span className="hidden lg:block">{t("general.flashcards")}</span>
          </Button>
        </Link>

        <Link href="/translate">
          <Button variant="ghost">
            <IconLanguage />
            <span className="hidden lg:block">{t("general.translate")}</span>
          </Button>
        </Link>

        {isAuthenticated && <UserButton className="absolute right-0 mr-4" />}
      </div>
    </nav>
  );
}
