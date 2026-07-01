import { useCallback, useEffect, useRef, useState } from "react";

import type { Direction } from "@/features/flashcards/types";

export function useDetectSwipeOnElement<T extends HTMLElement>(
  minSwipeLength = 50,
  onSwipe?: (direction: Direction) => void,
) {
  const [el, setEl] = useState<T | null>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<Direction | null>(null);

  const resetSwipeDirection = useCallback(() => setSwipeDirection(null), []);

  useEffect(() => {
    if (!el) return;

    const detectSwipe = (e: TouchEvent | MouseEvent) => {
      if (startX.current === null || startY.current === null) return;

      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY =
        "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;

      const diffX = startX.current - clientX;
      const diffY = startY.current - clientY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeLength) {
          const direction = (diffX > 0 ? "left" : "right") as Direction;
          setSwipeDirection(direction);
          onSwipe?.(direction);
          startX.current = null;
          startY.current = null;
        } else {
          setSwipeDirection(null);
        }
      } else {
        if (Math.abs(diffY) > minSwipeLength) {
          if (diffY > 0) {
            const direction = "up" as Direction;
            setSwipeDirection(direction);
            onSwipe?.(direction);
            startX.current = null;
            startY.current = null;
          } else {
            const direction = "down" as Direction;
            setSwipeDirection(direction);
            onSwipe?.(direction);
            startX.current = null;
            startY.current = null;
          }
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      startX.current = null;
      startY.current = null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      startX.current = e.clientX;
      startY.current = e.clientY;
    };

    const handleMouseUp = () => {
      startX.current = null;
      startY.current = null;
    };

    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchmove", detectSwipe);
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mousemove", detectSwipe);
    el.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", detectSwipe);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mousemove", detectSwipe);
      el.removeEventListener("mouseup", handleMouseUp);
    };
  }, [el, minSwipeLength, onSwipe]);

  const ref = useCallback((node: T | null) => {
    if (node) setEl(node);
  }, []);

  return {
    ref,
    swipeDirection,
    resetSwipeDirection,
  };
}
