"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useState } from "react";

import { FlashcardComp } from "@/features/flashcards/components/flashcard";
import { FlashcardStack } from "@/features/flashcards/components/flashcard-stack";
import {
  FADE_TRANSITION,
  FLASHCARD_STACK_STAGGER,
  FLASHCARD_SWIPE_THRESHOLD,
} from "@/features/flashcards/constants";
import type {
  DealtFlashcard,
  Direction,
  FlashcardExitDirections,
  FlashcardStackState,
} from "@/features/flashcards/types";
import { getFlashcardStackLayers } from "@/features/flashcards/utils";
import { useDetectSwipeOnElement } from "@/hooks/use-detect-swipe-on-element";
import { cn } from "@/lib/utils";

type FlashcardDeckProps = {
  dealtCard: DealtFlashcard | null;
  flipped: boolean;
  exitDirections: FlashcardExitDirections;
  stack: FlashcardStackState;
  emptyState: ReactNode;
  onFlip: () => void;
  onSwipe: (direction: Direction) => void;
  onExitComplete: () => void;
  onCardEntered: () => void;
  isReverse: boolean;
};

export const FlashcardDeck = ({
  dealtCard,
  flipped,
  exitDirections,
  stack,
  emptyState,
  onFlip,
  onSwipe,
  onExitComplete,
  onCardEntered,
  isReverse,
}: FlashcardDeckProps) => {
  const { ref: swipeRef } = useDetectSwipeOnElement<HTMLDivElement>(
    FLASHCARD_SWIPE_THRESHOLD,
    onSwipe,
  );

  const [introLayerDelays] = useState(
    () =>
      new Map(
        getFlashcardStackLayers(stack).map((layer, index) => [
          layer.id,
          index * FLASHCARD_STACK_STAGGER,
        ]),
      ),
  );
  const [introCardKey] = useState(dealtCard?.key);

  return (
    <div
      className={cn(
        "-m-1 p-1 select-none max-lg:overflow-x-clip",
        !emptyState && "touch-none",
      )}
      ref={swipeRef}
    >
      <div className="relative h-62 md:h-74 lg:h-84">
        <FlashcardStack stack={stack} introDelays={introLayerDelays} />

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
              revealsInPlace={stack.isLifted}
              enterDirection={dealtCard.enterDirection}
              enterDelay={
                dealtCard.key === introCardKey
                  ? introLayerDelays.size * FLASHCARD_STACK_STAGGER
                  : 0
              }
              onFlip={onFlip}
              onEntered={onCardEntered}
              isReverse={isReverse}
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
