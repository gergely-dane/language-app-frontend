"use client";

import { motion, useIsPresent, usePresenceData } from "motion/react";

import type { Translation } from "@/features/vocabulary/types";
import { cn } from "@/lib/utils";

import {
  CARD_TRANSITION,
  FLASHCARD_DEALT_TARGET,
  FLASHCARD_EXIT_TARGETS,
  FLASHCARD_HIDDEN_TARGET,
  FLASHCARD_HOVER_LIFT,
  FLASHCARD_STACKED_TARGET,
  HOVER_TRANSITION,
} from "../constants";
import type { FlashcardExitDirections } from "../types";
import { FlashcardSide } from "./flashcard-side";

// An onUpdate subscriber makes motion run all values on its JS frameloop instead of WAAPI, whose opacity animations some phones snap to the end state instantly.
const forceJsAnimation = () => {};

type FlashcardCompProps = {
  cardKey: string;
  translation: Translation;
  flipped: boolean;
  revealsInPlace: boolean;
  enterDelay: number;
  onFlip: () => void;
  onEntered: () => void;
  setEditDialogOpen?: (open: boolean) => void;
};

export const FlashcardComp = ({
  cardKey,
  translation,
  flipped,
  revealsInPlace,
  enterDelay,
  onFlip,
  onEntered,
  setEditDialogOpen,
}: FlashcardCompProps) => {
  const isPresent = useIsPresent();
  const exitDirections = usePresenceData() as
    | FlashcardExitDirections
    | undefined;
  const exitDirection = exitDirections?.[cardKey];

  return (
    // Opacity lives on this layer only: on the preserve-3d layer below it would flatten the faces and break backface hiding.
    <motion.div
      className={cn(
        "absolute inset-x-0 top-0 h-54 will-change-transform md:h-66 lg:h-76",
        !isPresent && "pointer-events-none",
        !isPresent && exitDirection && "z-10",
      )}
      style={{ perspective: 1600 }}
      initial={
        revealsInPlace ? FLASHCARD_HIDDEN_TARGET : FLASHCARD_STACKED_TARGET
      }
      animate={{
        ...FLASHCARD_DEALT_TARGET,
        transition: { ...CARD_TRANSITION, delay: enterDelay },
      }}
      exit={
        exitDirection
          ? FLASHCARD_EXIT_TARGETS[exitDirection]
          : FLASHCARD_STACKED_TARGET
      }
      transition={CARD_TRANSITION}
      onUpdate={forceJsAnimation}
      onAnimationComplete={() => {
        if (isPresent) onEntered();
      }}
    >
      <motion.div
        className="relative size-full cursor-pointer rounded-xl will-change-transform [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ ...CARD_TRANSITION, y: HOVER_TRANSITION }}
        whileHover={{ y: FLASHCARD_HOVER_LIFT }}
        whileTap={{ y: FLASHCARD_HOVER_LIFT }}
        onClick={onFlip}
      >
        <FlashcardSide
          translation={translation}
          isFront={true}
          setEditDialogOpen={setEditDialogOpen}
        />

        <FlashcardSide
          translation={translation}
          isFront={false}
          setEditDialogOpen={setEditDialogOpen}
        />
      </motion.div>
    </motion.div>
  );
};
