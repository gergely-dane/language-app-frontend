"use client";

import { IconRefresh } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { PRACTICE_MODE } from "@/features/flashcards/constants";
import type { PracticeMode } from "@/features/flashcards/types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type FlashcardEmptyStateProps = {
  hasError: boolean;
  practiceMode: PracticeMode;
  newCount: number;
  existingCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onPracticeModeChange: (practiceMode: PracticeMode) => void;
};

export const FlashcardEmptyState = ({
  hasError,
  practiceMode,
  newCount,
  existingCount,
  isRefreshing,
  onRefresh,
  onPracticeModeChange,
}: FlashcardEmptyStateProps) => {
  const t = useI18n();

  const content = (() => {
    if (hasError) {
      return { title: t("flashcards.errorLoadingFlashcard") };
    }

    if (practiceMode === PRACTICE_MODE.New && existingCount > 0) {
      return {
        title: t("flashcards.noNewWordsLeft"),
        description: t("flashcards.existingWordsWaiting", {
          count: existingCount,
        }),
        switchLabel: t("flashcards.practiceExistingWords"),
        switchMode: PRACTICE_MODE.Existing,
      };
    }

    if (practiceMode === PRACTICE_MODE.Existing && newCount > 0) {
      return {
        title: t("flashcards.allCaughtUp"),
        description: t("flashcards.newWordsWaiting", { count: newCount }),
        switchLabel: t("flashcards.practiceNewWords"),
        switchMode: PRACTICE_MODE.New,
      };
    }

    return {
      title: t("flashcards.congratulations"),
      description: t("flashcards.keepPracticing"),
    };
  })();

  return (
    <div className="bg-card flex h-58 flex-col items-center justify-center gap-2 rounded-xl border p-8 text-center md:h-70 lg:h-80">
      <h2 className="text-xl whitespace-pre-line">{content.title}</h2>

      {content.description && (
        <p className="text-muted-foreground max-w-md">{content.description}</p>
      )}

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {content.switchMode !== undefined && (
          <Button onClick={() => onPracticeModeChange(content.switchMode)}>
            {content.switchLabel}
          </Button>
        )}

        <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          <IconRefresh className={cn(isRefreshing && "animate-spin")} />

          {t("flashcards.refresh")}
        </Button>
      </div>
    </div>
  );
};
