"use client";

import { useCallback, useMemo, useState } from "react";

import {
  getFlashcardQueueQueryKey,
  useFlashcardQueue,
} from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
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
  getFlashcardStackDepth,
  getRemainingCount,
} from "@/features/flashcards/utils";

export const useFlashcardDeck = (
  params: FlashcardParams,
  onRespond?: (rating: FlashcardRating) => void,
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

  const {
    data: queue,
    isLoading,
    isFetching,
    isPlaceholderData,
    error,
    refetch,
  } = useFlashcardQueue(params, dealIndex);
  const { mutate: respondToFlashcard } = useRespondToFlashcard();

  const flashcard = queue?.flashcard ?? null;
  const remainingCount = queue ? getRemainingCount(queue, practiceMode) : 0;
  const isSettled = !isAdvancing && !isPlaceholderData;
  const isEmpty = isSettled && !isLoading && (!!error || !flashcard);

  const dealtCard = useMemo<DealtFlashcard | null>(
    () =>
      isSettled && !error && flashcard
        ? { key: `${dealIndex}-${flashcard.id}`, flashcard }
        : null,
    [dealIndex, error, flashcard, isSettled],
  );

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
    : queue && !isPlaceholderData
      ? getFlashcardStackDepth(remainingCount, isAdvancing)
      : stackDepth;

  if (nextStackDepth !== stackDepth) {
    setStackDepth(nextStackDepth);
  }

  const stack = useMemo<FlashcardStackState>(
    () => ({ drawCount, depth: nextStackDepth, isLifted: isDrawPending }),
    [drawCount, isDrawPending, nextStackDepth],
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

      onRespond?.(rating);
      setExitDirections((prev) => ({ ...prev, [dealtCard.key]: direction }));
      setIsAdvancing(true);
      setDrawCount((count) => count + 1);
      setIsDrawPending(remainingCount > 1);

      respondToFlashcard(
        {
          flashcardId: dealtCard.flashcard.id,
          flashcardIndex: respondedIndex,
          response: { response: rating, nextCardQuery: params },
        },
        {
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

  const redeal = useCallback(() => {
    setDealIndex((index) => index + 1);
    setIsDrawPending(false);
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
    flip,
    respond,
    redeal,
    clearExitDirections,
    onCardEntered,
  };
};
