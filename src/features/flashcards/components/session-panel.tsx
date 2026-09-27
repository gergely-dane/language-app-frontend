"use client";

import { CollapsibleSection } from "@/features/flashcards/components/collapsible-section";
import {
  FLASHCARD_DIRECTIONS,
  FLASHCARD_RATING_META,
  PRACTICE_MODE,
} from "@/features/flashcards/constants";
import type { Direction, PracticeMode } from "@/features/flashcards/types";
import { useI18n } from "@/hooks/use-i18n";

type SessionPanelProps = {
  reviewedCount: number;
  remainingCount: number;
  practiceMode: PracticeMode;
  tally: Record<Direction, number>;
};

export const SessionPanel = ({
  reviewedCount,
  remainingCount,
  practiceMode,
  tally,
}: SessionPanelProps) => {
  const t = useI18n();

  const remainingLabel =
    practiceMode === PRACTICE_MODE.New
      ? t("flashcards.newWordsLeft")
      : t("flashcards.reviewsLeft");

  const ratingLabels: Record<Direction, string> = {
    left: t("flashcards.didntKnow"),
    down: t("flashcards.wasntSure"),
    right: t("flashcards.knewIt"),
    up: t("flashcards.easy"),
  };

  return (
    <CollapsibleSection
      section="session"
      title={t("flashcards.session")}
      defaultCollapsedOnShortScreen
    >
      <div className="flex gap-y-1 max-lg:flex-wrap max-lg:items-baseline max-lg:gap-x-4 lg:flex-col">
        <div className="flex items-baseline gap-1.5">
          <p className="text-3xl font-semibold tabular-nums max-lg:text-lg">
            {reviewedCount}
          </p>

          <p className="text-muted-foreground text-xs">
            {t("flashcards.reviewed")}
          </p>
        </div>

        <div className="flex items-baseline gap-1.5">
          <p className="text-3xl font-semibold tabular-nums max-lg:text-lg">
            {remainingCount}
          </p>

          <p className="text-muted-foreground text-xs">{remainingLabel}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-6">
        {FLASHCARD_DIRECTIONS.map((direction) => {
          const meta = FLASHCARD_RATING_META[direction];
          const Icon = meta.icon;

          return (
            <div
              key={direction}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <Icon size={14} className={meta.iconClass} />

                <span className="text-muted-foreground">
                  {ratingLabels[direction]}
                </span>
              </span>

              <span className="tabular-nums">{tally[direction]}</span>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
};
