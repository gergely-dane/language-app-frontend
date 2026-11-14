"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import {
  getFlashcardQueueQueryKey,
  useFlashcardQueue,
} from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
import { useUndoFlashcardReview } from "@/features/flashcards/api/undo-flashcard-review";
import {
  DEFAULT_PRACTICE_MODE,
  FLASHCARD_DIRECTION_RATINGS,
} from "@/features/flashcards/constants";
import type {
  DealtFlashcard,
  Direction,
  FlashcardExitDirections,
  FlashcardParams,
  FlashcardRating,
  FlashcardStackState,
} from "@/features/flashcards/types";
import {
  getDealtFlashcardKey,
  getFlashcardStackDepth,
  getRemainingCount,
} from "@/features/flashcards/utils";

type ReviewedFlashcard = {
  flashcardId: number;
  direction: Direction;
};

type ReturningFlashcard = {
  key: string;
  direction: Direction;
};

export const useFlashcardDeck = (
  params: FlashcardParams,
  onRespond?: (rating: FlashcardRating) => void,
  onUndo?: () => void,
) => {
  const isReverse = params.isReverse ?? false;
  const practiceMode = params.practiceMode ?? DEFAULT_PRACTICE_MODE;

  const [dealIndex, setDealIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [exitDirections, setExitDirections] = useState<FlashcardExitDirections>(
    {},
  );
  const [flipped, setFlipped] = useState(isReverse);
  const [revealed, setRevealed] = useState(false);
  const [lastDealtKey, setLastDealtKey] = useState<string | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const [isDrawPending, setIsDrawPending] = useState(false);
  const [stackDepth, setStackDepth] = useState(0);
  const [isUndoing, setIsUndoing] = useState(false);
  const [lastReviewed, setLastReviewed] = useState<ReviewedFlashcard | null>(
    null,
  );
  const [returningCard, setReturningCard] = useState<ReturningFlashcard | null>(
    null,
  );
  const redealCountRef = useRef(0);

  const {
    data: queue,
    isLoading,
    isFetching,
    isPlaceholderData,
    error,
    refetch,
  } = useFlashcardQueue(params, dealIndex);
  const { mutate: respondToFlashcard } = useRespondToFlashcard();
  const { mutate: undoFlashcardReview } = useUndoFlashcardReview();

  const flashcard = queue?.flashcard ?? null;
  const remainingCount = queue ? getRemainingCount(queue, practiceMode) : 0;
  const isSettled = !isAdvancing && !isUndoing && !isPlaceholderData;
  const isEmpty = isSettled && !isLoading && (!!error || !flashcard);
  const canUndo = !!lastReviewed && !isAdvancing && !isUndoing;

  const dealtCard = useMemo<DealtFlashcard | null>(() => {
    if (!isSettled || error || !flashcard) return null;

    const key = getDealtFlashcardKey(dealIndex, flashcard.id);

    return {
      key,
      flashcard,
      enterDirection:
        returningCard?.key === key ? returningCard.direction : undefined,
    };
  }, [dealIndex, error, flashcard, isSettled, returningCard]);

  if (dealtCard && dealtCard.key !== lastDealtKey) {
    setLastDealtKey(dealtCard.key);
    setFlipped(isReverse);
    setRevealed(false);
  }

  if (isEmpty && isDrawPending) {
    setIsDrawPending(false);
  }

  const nextStackDepth = isEmpty
    ? 0
    : isUndoing
      ? getFlashcardStackDepth(remainingCount + 1, false)
      : queue && !isPlaceholderData
        ? getFlashcardStackDepth(remainingCount, isAdvancing)
        : stackDepth;

  if (nextStackDepth !== stackDepth) {
    setStackDepth(nextStackDepth);
  }

  const stack = useMemo<FlashcardStackState>(
    () => ({
      drawCount,
      depth: nextStackDepth,
      isLifted: isDrawPending,
      isSinking: isUndoing,
    }),
    [drawCount, isDrawPending, isUndoing, nextStackDepth],
  );

  const flip = useCallback(() => {
    if (!dealtCard) return;

    setFlipped((prev) => !prev);
    setRevealed(true);
  }, [dealtCard]);

  const respond = useCallback(
    (direction: Direction) => {
      if (!dealtCard) return;

      const rating = FLASHCARD_DIRECTION_RATINGS[direction];
      const respondedIndex = dealIndex;
      const respondedRedealCount = redealCountRef.current;
      const flashcardId = dealtCard.flashcard.id;

      onRespond?.(rating);
      setExitDirections((prev) => ({ ...prev, [dealtCard.key]: direction }));
      setIsAdvancing(true);
      setDrawCount((count) => count + 1);
      setIsDrawPending(remainingCount > 1);
      setLastReviewed(null);

      respondToFlashcard(
        {
          flashcardId,
          flashcardIndex: respondedIndex,
          response: { response: rating, nextCardQuery: params },
        },
        {
          onSuccess: () => {
            if (redealCountRef.current === respondedRedealCount) {
              setLastReviewed({ flashcardId, direction });
            }
          },
          onSettled: () => {
            setIsAdvancing(false);
            setDealIndex((index) =>
              index === respondedIndex ? index + 1 : index,
            );
          },
        },
      );
    },
    [
      dealIndex,
      dealtCard,
      onRespond,
      params,
      remainingCount,
      respondToFlashcard,
    ],
  );

  const undo = useCallback(() => {
    if (!lastReviewed || !canUndo) return;

    const { flashcardId, direction } = lastReviewed;
    const undoneIndex = dealIndex;

    setLastReviewed(null);
    setIsUndoing(true);
    setIsDrawPending(false);
    setDrawCount((count) => count - 1);

    undoFlashcardReview(
      {
        flashcardId,
        flashcardIndex: undoneIndex,
        request: { nextCardQuery: params },
      },
      {
        onSuccess: () => {
          onUndo?.();
          setReturningCard({
            key: getDealtFlashcardKey(undoneIndex + 1, flashcardId),
            direction,
          });
          setDealIndex((index) => (index === undoneIndex ? index + 1 : index));
        },
        onError: () => setDrawCount((count) => count + 1),
        onSettled: () => setIsUndoing(false),
      },
    );
  }, [canUndo, dealIndex, lastReviewed, onUndo, params, undoFlashcardReview]);

  const redeal = useCallback(() => {
    redealCountRef.current += 1;
    setDealIndex((index) => index + 1);
    setIsDrawPending(false);
    setLastReviewed(null);
  }, []);

  const clearExitDirections = useCallback(() => setExitDirections({}), []);

  const onCardEntered = useCallback(() => setIsDrawPending(false), []);

  return {
    queue,
    isLoading,
    isFetching,
    error,
    refetch,
    flashcard,
    flashcardQueryKey: getFlashcardQueueQueryKey(params, dealIndex),
    dealtCard,
    isEmpty,
    flipped,
    revealed,
    exitDirections,
    stack,
    canUndo,
    flip,
    respond,
    undo,
    redeal,
    clearExitDirections,
    onCardEntered,
  };
};
