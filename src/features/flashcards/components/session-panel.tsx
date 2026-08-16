"use client";

import { SectionLabel } from "@/features/flashcards/components/section-label";
import {
  FLASHCARD_DIRECTIONS,
  FLASHCARD_RATING_META,
} from "@/features/flashcards/constants";
import type { Direction } from "@/features/flashcards/types";
import { useI18n } from "@/hooks/use-i18n";

type SessionPanelProps = {
  reviewedCount: number;
  remainingCount: number;
  tally: Record<Direction, number>;
  ratingLabels: Record<Direction, string>;
};

export const SessionPanel = ({
  reviewedCount,
  remainingCount,
  tally,
  ratingLabels,
}: SessionPanelProps) => {
  const t = useI18n();

  return (
    <section className="bg-card max-lg:short:hidden flex flex-col gap-3 rounded-xl border p-4 max-lg:gap-2 max-lg:py-3">
      <SectionLabel>{t("flashcards.session")}</SectionLabel>

      <div className="flex flex-col gap-3 max-lg:gap-2">
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

            <p className="text-muted-foreground text-xs">
              {t("flashcards.reviewsLeft")}
            </p>
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
      </div>
    </section>
  );
};
