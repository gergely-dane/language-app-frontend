"use client";

import ReviewTimeDisplay from "@/features/flashcards/components/review-time-display";
import {
  FLASHCARD_DIRECTIONS,
  FLASHCARD_RATING_META,
} from "@/features/flashcards/constants";
import type { Direction, Flashcard } from "@/features/flashcards/types";
import { cn } from "@/lib/utils";

type FlashcardResponseButtonsProps = {
  flashcard: Flashcard | null;
  labels: Record<Direction, string>;
  isHidden: boolean;
  areTimesHidden: boolean;
  disabledDirections: Direction[];
  onRespond: (direction: Direction) => void;
};

export const FlashcardResponseButtons = ({
  flashcard,
  labels,
  isHidden,
  areTimesHidden,
  disabledDirections,
  onRespond,
}: FlashcardResponseButtonsProps) => (
  <div
    className={cn(
      "bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border transition-opacity sm:grid-cols-4",
      isHidden && "pointer-events-none opacity-0",
    )}
  >
    {FLASHCARD_DIRECTIONS.map((direction) => {
      const meta = FLASHCARD_RATING_META[direction];
      const Icon = meta.icon;

      return (
        <button
          key={direction}
          type="button"
          className={cn(
            "bg-card max-lg:short:py-2 flex cursor-pointer flex-col items-center gap-1 px-2 py-3 transition-colors disabled:pointer-events-none disabled:opacity-40",
            meta.hoverClass,
            meta.mobileOrderClass,
          )}
          disabled={disabledDirections.includes(direction)}
          onClick={() => onRespond(direction)}
        >
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <Icon size={18} className={meta.iconClass} />
            {labels[direction]}
          </span>

          <ReviewTimeDisplay
            minutes={flashcard?.[meta.timeKey] ?? 0}
            className={cn(
              "text-xs transition-opacity",
              areTimesHidden && "opacity-0",
            )}
          />
        </button>
      );
    })}
  </div>
);
