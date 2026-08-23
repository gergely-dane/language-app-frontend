import { useCallback, useEffect, useRef, useState } from "react";

import type { Direction } from "@/features/flashcards/types";

export function useDetectSwipeOnElement<T extends HTMLElement>(
  minSwipeLength = 50,
  onSwipe?: (direction: Direction) => void,
) {
  const [el, setEl] = useState<T | null>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!el) return;

    const endSwipe = () => {
      startX.current = null;
      startY.current = null;
    };

    const detectSwipe = (e: TouchEvent) => {
      if (startX.current === null || startY.current === null) return;

      const diffX = startX.current - e.changedTouches[0].clientX;
      const diffY = startY.current - e.changedTouches[0].clientY;

      let direction: Direction | null = null;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeLength) {
          direction = diffX > 0 ? "left" : "right";
        }
      } else if (Math.abs(diffY) > minSwipeLength) {
        direction = diffY > 0 ? "up" : "down";
      }

      if (direction) {
        onSwipe?.(direction);
        endSwipe();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchmove", detectSwipe);
    el.addEventListener("touchend", endSwipe);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", detectSwipe);
      el.removeEventListener("touchend", endSwipe);
    };
  }, [el, minSwipeLength, onSwipe]);

  const ref = useCallback((node: T | null) => {
    if (node) setEl(node);
  }, []);

  return { ref };
}
