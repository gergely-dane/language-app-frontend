"use client";

import { IconBook2, IconCards } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type StatisticsEmptyStateProps = {
  className?: string;
};

export const StatisticsEmptyState = ({
  className,
}: StatisticsEmptyStateProps) => {
  const t = useI18n();

  return (
    <div
      className={cn(
        "bg-card flex flex-col items-center justify-center gap-6 rounded-lg border p-12 shadow-sm",
        className,
      )}
    >
      <div className="bg-primary/10 flex size-20 items-center justify-center rounded-full">
        <IconBook2 className="text-primary size-10" />
      </div>

      <div className="text-center">
        <h2 className="text-xl">{t("statistics.emptyState.title")}</h2>

        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {t("statistics.emptyState.description")}
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/vocabulary">
            <IconBook2 className="size-4" />
            {t("statistics.emptyState.addTranslations")}
          </Link>
        </Button>

        <Button asChild>
          <Link href="/flashcards">
            <IconCards className="size-4" />
            {t("statistics.emptyState.startReviewing")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
