"use client";

import { useEffect } from "react";

import { FLASHCARD_KEY_DIRECTIONS } from "@/features/flashcards/constants";
import type { Direction } from "@/features/flashcards/types";
import { isEditableTarget } from "@/features/flashcards/utils";

type UseFlashcardShortcutsOptions = {
  enabled: boolean;
  onFlip: () => void;
  onRespond: (direction: Direction) => void;
};

export const useFlashcardShortcuts = ({
  enabled,
  onFlip,
  onRespond,
}: UseFlashcardShortcutsOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.defaultPrevented ||
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        isEditableTarget(e.target)
      ) {
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        onFlip();
        return;
      }

      const direction = FLASHCARD_KEY_DIRECTIONS[e.key];
      if (!direction) return;

      e.preventDefault();
      onRespond(direction);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onFlip, onRespond]);
};
