"use client";

import { useCallback, useMemo, useState } from "react";

import {
  getFlashcardQueueQueryKey,
  useFlashcardQueue,
} from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
import { FLASHCARD_DIRECTION_RATINGS } from "@/features/flashcards/constants";
import type {
  DealtFlashcard,
  Direction,
  FlashcardExitDirections,
  FlashcardParams,
  FlashcardRating,
} from "@/features/flashcards/types";

export const useFlashcardDeck = (
  params: FlashcardParams,
  onRespond?: (rating: FlashcardRating) => void,
) => {
  const isReverse = params.isReverse ?? false;

  const [dealIndex, setDealIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [exitDirections, setExitDirections] = useState<FlashcardExitDirections>(
    {},
  );
  const [flipped, setFlipped] = useState(isReverse);
  const [revealed, setRevealed] = useState(false);
  const [lastDealtKey, setLastDealtKey] = useState<string | null>(null);

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
    [dealIndex, dealtCard, onRespond, params, respondToFlashcard],
  );

  const redeal = useCallback(() => setDealIndex((index) => index + 1), []);

  const clearExitDirections = useCallback(() => setExitDirections({}), []);

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
    flip,
    respond,
    redeal,
    clearExitDirections,
  };
};
