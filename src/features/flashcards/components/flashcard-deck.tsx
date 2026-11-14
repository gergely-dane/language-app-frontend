"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { FlashcardComp } from "@/features/flashcards/components/flashcard";
import { FlashcardStack } from "@/features/flashcards/components/flashcard-stack";
import {
  FADE_TRANSITION,
  FLASHCARD_SWIPE_THRESHOLD,
} from "@/features/flashcards/constants";
import type {
  DealtFlashcard,
  Direction,
  FlashcardExitDirections,
} from "@/features/flashcards/types";
import { useDetectSwipeOnElement } from "@/hooks/use-detect-swipe-on-element";
import { cn } from "@/lib/utils";

type FlashcardDeckProps = {
  dealtCard: DealtFlashcard | null;
  flipped: boolean;
  exitDirections: FlashcardExitDirections;
  emptyState: ReactNode;
  onFlip: () => void;
  onSwipe: (direction: Direction) => void;
  onExitComplete: () => void;
  setEditDialogOpen: (open: boolean) => void;
};

export const FlashcardDeck = ({
  dealtCard,
  flipped,
  exitDirections,
  emptyState,
  onFlip,
  onSwipe,
  onExitComplete,
  setEditDialogOpen,
}: FlashcardDeckProps) => {
  const { ref: swipeRef } = useDetectSwipeOnElement<HTMLDivElement>(
    FLASHCARD_SWIPE_THRESHOLD,
    onSwipe,
  );

  return (
    <div
      className={cn(
        "-m-1 p-1 select-none max-lg:overflow-x-clip",
        !emptyState && "touch-none",
      )}
      ref={swipeRef}
    >
      <div className="relative h-58 md:h-70 lg:h-80">
        <FlashcardStack isHidden={!!emptyState} />

        <AnimatePresence
          custom={exitDirections}
          onExitComplete={onExitComplete}
        >
          {dealtCard && (
            <FlashcardComp
              key={dealtCard.key}
              cardKey={dealtCard.key}
              translation={dealtCard.flashcard.translation}
              flipped={flipped}
              onFlip={onFlip}
              setEditDialogOpen={setEditDialogOpen}
            />
          )}

          {emptyState && (
            <motion.div
              key="empty"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
            >
              {emptyState}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
