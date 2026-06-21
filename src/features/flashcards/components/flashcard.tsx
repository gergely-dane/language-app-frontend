"use client";

import { motion } from "motion/react";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useDetectSwipeOnElement } from "@/hooks/use-detect-swipe-on-element";
import { cn } from "@/utils/cn";

import { FLIP_TRANSITION, SWIPE_TRANSITION } from "../constants";
import type { Direction, FlashcardCompHandle } from "../types";
import { getCardAnimation } from "../utils";
import { FlashcardSide } from "./flashcard-side";

type FlashcardCompProps = {
  className?: string;
  translation: Translation;
  disabled?: boolean;
  onAnimationStateChange?: (isAnimating: boolean) => void;
  onFlipStateChange?: (flipped: boolean) => void;
  onRespond?: (direction: Direction) => void;
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
      onAnimationStateChange,
      onFlipStateChange,
      onRespond,
      onSwipeAnimationComplete,
      setEditDialogOpen,
    },
    ref,
  ) => {
    const [flipped, setFlipped] = useState(false);
    const [isFlipAnimating, setIsFlipAnimating] = useState(false);
    const [swipeAnimationDirection, setSwipeAnimationDirection] =
      useState<Direction | null>(null);

    const reset = useCallback(() => {
      setFlipped(false);
      onFlipStateChange?.(false);
      setIsFlipAnimating(false);
      setSwipeAnimationDirection(null);
    }, [onFlipStateChange]);

    const startFlip = useCallback(() => {
      if (disabled) return;

      setFlipped((prev) => !prev);
      setIsFlipAnimating(true);
    }, [disabled]);

    const respond = useCallback(
      (direction: Direction) => {
        if (disabled) return;

        onRespond?.(direction);
        setSwipeAnimationDirection(direction);
      },
      [disabled, onRespond],
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

    const handleAnimationComplete = () => {
      onAnimationStateChange?.(false);
      if (swipeAnimationDirection) {
        onSwipeAnimationComplete?.(swipeAnimationDirection);
      } else {
        setIsFlipAnimating(false);
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
      <div className={cn("touch-none select-none", className)} ref={swipeRef}>
        <div className="relative h-68" style={{ perspective: 1600 }}>
          <div
            aria-hidden="true"
            className="ring-foreground absolute inset-x-0 top-4 mx-auto h-60 w-[98%] rounded-xl bg-[oklch(from_var(--color-primary)_calc(l*1.3)_c_h)] ring-2"
          />
          <div
            aria-hidden="true"
            className="ring-foreground absolute inset-x-0 top-2 mx-auto h-60 w-[99%] rounded-xl bg-[oklch(from_var(--color-primary)_calc(l*1.15)_c_h)] ring-2"
          />

          <motion.div
            className="relative h-60 flex-1 cursor-pointer rounded-xl [transform-style:preserve-3d] hover:will-change-transform"
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={getCardAnimation(flipped, swipeAnimationDirection)}
            transition={
              swipeAnimationDirection ? SWIPE_TRANSITION : FLIP_TRANSITION
            }
            whileHover={
              swipeAnimationDirection ? undefined : { scale: 1.02, y: -2 }
            }
            whileTap={
              swipeAnimationDirection ? undefined : { scale: 1.005, y: 0 }
            }
            onClick={() => startFlip()}
            onAnimationComplete={() => handleAnimationComplete()}
          >
            <FlashcardSide
              translation={translation}
              isFront={true}
              flipped={flipped}
              swipeAnimationPlaying={!!swipeAnimationDirection}
              setEditDialogOpen={setEditDialogOpen}
            />

            <FlashcardSide
              translation={translation}
              isFront={false}
              flipped={flipped}
              swipeAnimationPlaying={!!swipeAnimationDirection}
              setEditDialogOpen={setEditDialogOpen}
            />
          </motion.div>
        </div>
      </div>
    );
  },
);

FlashcardComp.displayName = "FlashcardComp";
