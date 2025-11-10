import { useCallback, useEffect, useRef, useState } from "react";

export function useDetectSwipeOnElement<T extends HTMLElement>(
  minSwipeLength = 50,
) {
  const [el, setEl] = useState<T | null>(null);
  const startX = useRef<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );

  const resetSwipeDirection = useCallback(() => setSwipeDirection(null), []);

  useEffect(() => {
    if (!el) return;

    const detectSwipe = (e: TouchEvent | MouseEvent) => {
      if (startX.current === null) return;

      const diff =
        startX.current -
        ("changedTouches" in e ? e.changedTouches[0].clientX : e.clientX);
      if (Math.abs(diff) > minSwipeLength) {
        setSwipeDirection(diff > 0 ? "left" : "right");
        startX.current = null;
      } else {
        setSwipeDirection(null);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      startX.current = null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      startX.current = e.clientX;
    };

    const handleMouseUp = () => {
      startX.current = null;
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
  }, [el, minSwipeLength]);

  const ref = useCallback((node: T | null) => {
    if (node) setEl(node);
  }, []);

  return {
    ref,
    swipeDirection,
    resetSwipeDirection,
  };
}
