"use client";

import {
  type AnimationDefinition,
  motion,
  type TargetAndTransition,
} from "motion/react";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import type { Translation } from "@/features/vocabulary/types";
import { useDetectSwipeOnElement } from "@/hooks/use-detect-swipe-on-element";
import { cn } from "@/lib/utils";

import { FLIP_TRANSITION, SWIPE_TRANSITION } from "../constants";
import type { Direction, FlashcardCompHandle } from "../types";
import { getCardAnimation } from "../utils";
import { FlashcardSide } from "./flashcard-side";

type FlashcardCompProps = {
  className?: string;
  translation: Translation;
  disabled?: boolean;
  isReverse?: boolean;
  isLoading?: boolean;
  onAnimationStateChange?: (isAnimating: boolean) => void;
  onFlipStateChange?: (flipped: boolean) => void;
  onRespond?: (direction: Direction) => void;
  onSwipeAnimationStart?: () => void;
  onSwipeAnimationComplete?: (direction: Direction) => void;
  setEditDialogOpen?: (open: boolean) => void;
};

export const FlashcardComp = React.forwardRef<
  FlashcardCompHandle,
  FlashcardCompProps
>(
  (
    {
      className,
      translation,
      disabled = false,
      isReverse = false,
      isLoading = false,
      onAnimationStateChange,
      onFlipStateChange,
      onRespond,
      onSwipeAnimationStart,
      onSwipeAnimationComplete,
      setEditDialogOpen,
    },
    ref,
  ) => {
    const [displayTranslation, setDisplayTranslation] = useState(translation);

    const [flipped, setFlipped] = useState(isReverse);
    const [isFlipAnimating, setIsFlipAnimating] = useState(false);
    const [swipeAnimationDirection, setSwipeAnimationDirection] =
      useState<Direction | null>(null);
    const [isEntering, setIsEntering] = useState(true);

    const currentDisplayTranslation = swipeAnimationDirection
      ? displayTranslation
      : translation;

    const reset = useCallback(() => {
      setFlipped(isReverse);
      onFlipStateChange?.(isReverse);
      setIsFlipAnimating(false);
      setSwipeAnimationDirection(null);
      setIsEntering(true);
    }, [isReverse, onFlipStateChange]);

    const startFlip = useCallback(() => {
      if (disabled) return;

      setFlipped((prev) => !prev);
      setIsFlipAnimating(true);
    }, [disabled]);

    const respond = useCallback(
      (direction: Direction) => {
        if (disabled) return;

        setDisplayTranslation(translation);
        onRespond?.(direction);
        setSwipeAnimationDirection(direction);
        onSwipeAnimationStart?.();
      },
      [disabled, onRespond, onSwipeAnimationStart, translation],
    );

    const { ref: swipeRef } = useDetectSwipeOnElement<HTMLDivElement>(
      50,
      useCallback(
        (direction: Direction) => {
          respond(direction);
        },
        [respond],
      ),
    );

    const handleAnimationComplete = (definition: AnimationDefinition) => {
      // Gesture and interrupted animations complete too; only react to the target we animated to.
      const target = definition as TargetAndTransition;

      if (swipeAnimationDirection) {
        if (target.opacity === 0) {
          onAnimationStateChange?.(false);
          onSwipeAnimationComplete?.(swipeAnimationDirection);
        }
        return;
      }

      if (target.opacity === 1) {
        onAnimationStateChange?.(false);
        setIsFlipAnimating(false);
        setIsEntering(false);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        flip: startFlip,
        respond,
        reset,
      }),
      [reset, respond, startFlip],
    );

    useEffect(() => {
      onAnimationStateChange?.(isFlipAnimating || !!swipeAnimationDirection);
    }, [isFlipAnimating, onAnimationStateChange, swipeAnimationDirection]);

    useEffect(() => {
      if (flipped) {
        onFlipStateChange?.(true);
      }
    }, [flipped, onFlipStateChange]);

    useEffect(() => {
      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case " ":
            e.preventDefault();
            startFlip();
            break;
          case "ArrowLeft":
            e.preventDefault();
            respond("left");
            break;
          case "ArrowDown":
            e.preventDefault();
            respond("down");
            break;
          case "ArrowUp":
            e.preventDefault();
            respond("up");
            break;
          case "ArrowRight":
            e.preventDefault();
            respond("right");
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [disabled, respond, startFlip]);

    return (
      <div
        className={cn("cursor-pointer touch-none p-1 select-none", className)}
        ref={swipeRef}
      >
        <div
          className="relative h-62 md:h-74 lg:h-84"
          style={{ perspective: 1600 }}
        >
          <div
            aria-hidden="true"
            className="ring-foreground absolute inset-x-0 top-4 mx-auto h-54 w-[98%] rounded-xl bg-[oklch(from_var(--color-primary)_calc(l*1.3)_c_h)] ring-2 md:h-66 lg:h-76"
          />
          <div
            aria-hidden="true"
            className="ring-foreground absolute inset-x-0 top-2 mx-auto h-54 w-[99%] rounded-xl bg-[oklch(from_var(--color-primary)_calc(l*1.15)_c_h)] ring-2 md:h-66 lg:h-76"
          />

          <motion.div
            className={cn(
              "relative h-54 flex-1 cursor-pointer rounded-xl will-change-transform [transform-style:preserve-3d] md:h-66 lg:h-76",
              swipeAnimationDirection && "pointer-events-none",
            )}
            initial={{
              ...getCardAnimation(isReverse, null),
              opacity: 0,
              scale: 0.98,
              y: 16,
            }}
            animate={getCardAnimation(flipped, swipeAnimationDirection)}
            transition={
              swipeAnimationDirection ? SWIPE_TRANSITION : FLIP_TRANSITION
            }
            whileHover={swipeAnimationDirection ? undefined : { y: -4 }}
            whileTap={swipeAnimationDirection ? undefined : { y: -4 }}
            onClick={() => startFlip()}
            onAnimationComplete={handleAnimationComplete}
          >
            <FlashcardSide
              translation={!isLoading ? currentDisplayTranslation : undefined}
              isFront={true}
              flipped={flipped}
              forceHideBackface={!!swipeAnimationDirection || isEntering}
              setEditDialogOpen={setEditDialogOpen}
            />

            <FlashcardSide
              translation={!isLoading ? currentDisplayTranslation : undefined}
              isFront={false}
              flipped={flipped}
              forceHideBackface={!!swipeAnimationDirection || isEntering}
              setEditDialogOpen={setEditDialogOpen}
            />
          </motion.div>
        </div>
      </div>
    );
  },
);

FlashcardComp.displayName = "FlashcardComp";
