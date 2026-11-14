"use client";

import { motion } from "motion/react";
import { useState } from "react";

import {
  CARD_TRANSITION,
  FADE_TRANSITION,
  FLASHCARD_STACK_DEPTHS,
  FLASHCARD_STACK_HIDDEN_TARGET,
  STACK_COLOR_TRANSITION,
} from "@/features/flashcards/constants";
import { cn } from "@/lib/utils";

type FlashcardStackLayerProps = {
  depth: number;
  introDelay: number;
};

export const FlashcardStackLayer = ({
  depth,
  introDelay,
}: FlashcardStackLayerProps) => {
  const [delay, setDelay] = useState(introDelay);
  const { target, colorClass } = FLASHCARD_STACK_DEPTHS[depth];

  return (
    <motion.div
      className={cn(
        "ring-foreground absolute inset-x-0 top-0 h-54 rounded-xl ring-2 will-change-transform md:h-66 lg:h-76",
        colorClass,
      )}
      style={{ transition: STACK_COLOR_TRANSITION }}
      initial={FLASHCARD_STACK_HIDDEN_TARGET}
      animate={{
        ...target,
        opacity: 1,
        transition: { ...CARD_TRANSITION, delay },
      }}
      exit={
        depth === 0
          ? { opacity: 0, transition: FADE_TRANSITION }
          : FLASHCARD_STACK_HIDDEN_TARGET
      }
      transition={CARD_TRANSITION}
      onAnimationComplete={() => setDelay(0)}
    />
  );
};
