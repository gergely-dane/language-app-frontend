"use client";

import { AnimatePresence } from "motion/react";

import { FlashcardStackLayer } from "@/features/flashcards/components/flashcard-stack-layer";
import type { FlashcardStackState } from "@/features/flashcards/types";
import { getFlashcardStackLayers } from "@/features/flashcards/utils";

type FlashcardStackProps = {
  stack: FlashcardStackState;
  introDelays: ReadonlyMap<number, number>;
};

export const FlashcardStack = ({ stack, introDelays }: FlashcardStackProps) => (
  <div aria-hidden="true" className="absolute inset-0">
    <AnimatePresence>
      {getFlashcardStackLayers(stack).map((layer) => (
        <FlashcardStackLayer
          key={layer.id}
          depth={layer.depth}
          introDelay={introDelays.get(layer.id) ?? 0}
        />
      ))}
    </AnimatePresence>
  </div>
);
