"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";
import { IconCards, IconHome, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNavbar = () => {
  const t = useI18n();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 flex flex-cols w-full shadow-sm h-14 z-10 text-muted-foreground border-t">
      <Link href="/" className="flex-1">
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col w-full h-full rounded-none gap-0 bg-muted",
            {
              "bg-primary text-white": pathname === "/",
            },
          )}
        >
          <IconHome className="scale-120" />
          <p>{t("general.home")}</p>
        </Button>
      </Link>

      <Link href="/vocabulary" className="flex-1">
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col w-full h-full rounded-none gap-0 bg-muted",
            {
              "bg-primary text-white": pathname === "/vocabulary",
            },
          )}
        >
          <IconList className="scale-120" />
          <p>{t("general.vocabulary")}</p>
        </Button>
      </Link>

      <Link href="/flashcards" className="flex-1">
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col w-full h-full rounded-none gap-0 bg-muted",
            {
              "bg-primary text-white": pathname === "/flashcards",
            },
          )}
        >
          <IconCards className="scale-120" />
          <p>{t("general.flashcards")}</p>
        </Button>
      </Link>
    </nav>
  );
};
