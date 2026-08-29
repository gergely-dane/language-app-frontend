"use client";

import { IconPencil, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CheckboxButton } from "@/components/common/checkbox-button";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type FlashcardParams,
  useFlashcard,
} from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
import { FlashcardComp } from "@/features/flashcards/components/flashcard";
import {
  FlashcardResponseButtonsSkeleton,
  FlashcardSkeleton,
} from "@/features/flashcards/components/flashcard-skeleton";
import ReviewTimeDisplay from "@/features/flashcards/components/review-time-display";
import { SectionLabel } from "@/features/flashcards/components/section-label";
import { SessionPanel } from "@/features/flashcards/components/session-panel";
import {
  FLASHCARD_DIRECTION_RATINGS,
  FLASHCARD_DIRECTIONS,
  FLASHCARD_RATING_META,
} from "@/features/flashcards/constants";
import { useFlashcardSession } from "@/features/flashcards/hooks/use-flashcard-session";
import type {
  Direction,
  FlashcardCompHandle,
  FlashcardRating,
} from "@/features/flashcards/types";
import {
  getStoredFlashcardFilters,
  storeFlashcardFilters,
} from "@/features/flashcards/utils";
import { useLanguages } from "@/features/languages/api/get-languages";
import { LanguagePairSelector } from "@/features/languages/components/language-pair-selector";
import { type LanguageFilterValue } from "@/features/languages/types";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit/add-edit-word-dialog";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const FlashcardsPage = () => {
  const t = useI18n();
  const flashcardRef = useRef<FlashcardCompHandle | null>(null);

  const [storedFiltersState] = useState(getStoredFlashcardFilters);

  const [languagePair, setLanguagePair] = useState<LanguageFilterValue | null>(
    () => {
      if (storedFiltersState) {
        return {
          sourceLanguageId: storedFiltersState.sourceLanguageId ?? null,
          targetLanguageId: storedFiltersState.targetLanguageId ?? null,
        } satisfies LanguageFilterValue;
      }
      return null;
    },
  );
  const [isReverse, setIsReverse] = useState(() => {
    if (storedFiltersState) {
      return storedFiltersState.isReverse ?? false;
    }
    return false;
  });
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { sessionHistory, recordResponse } = useFlashcardSession();

  const flashcardParams = useMemo<FlashcardParams>(
    () => ({
      sourceLanguageId: languagePair?.sourceLanguageId,
      targetLanguageId: languagePair?.targetLanguageId,
      isReverse,
    }),
    [languagePair, isReverse],
  );

  useEffect(() => {
    storeFlashcardFilters(flashcardParams);
  }, [flashcardParams]);

  const {
    data: flashcard,
    isLoading: isFlashcardLoading,
    isFetching,
    error,
    refetch,
  } = useFlashcard(flashcardParams, flashcardIndex);
  const { isLoading: isLanguagesLoading } = useLanguages();
  const isLoading = isFlashcardLoading || isLanguagesLoading;
  const respondToFlashcard = useRespondToFlashcard(flashcardIndex);

  const areButtonsDisabled =
    isCardAnimating || respondToFlashcard.isPending || editDialogOpen;

  const [lastRemainingCount, setLastRemainingCount] = useState(0);
  if (flashcard && flashcard.remainingCount !== lastRemainingCount) {
    setLastRemainingCount(flashcard.remainingCount);
  }

  const handleRespondByRating = useCallback(
    async (response: FlashcardRating) => {
      if (isCardAnimating || respondToFlashcard.isPending || !flashcard) {
        return;
      }

      recordResponse(response);

      await respondToFlashcard.mutateAsync({
        flashcardId: flashcard.id,
        response: {
          response,
          nextCardQuery: flashcardParams,
        },
      });
    },
    [
      isCardAnimating,
      respondToFlashcard,
      flashcard,
      recordResponse,
      flashcardParams,
    ],
  );

  const handleRespond = useCallback(
    (direction: Direction) => {
      void handleRespondByRating(FLASHCARD_DIRECTION_RATINGS[direction]);
    },
    [handleRespondByRating],
  );

  const onSwipeAnimationComplete = () => {
    setFlashcardIndex((prev) => prev + 1);
    setWasFlipped(false);
    setIsSwipeAnimating(false);
  };

  const onLanguagePairChange = (newPair: LanguageFilterValue | null) => {
    setLanguagePair(newPair);
    setFlashcardIndex(0);
    flashcardRef.current?.reset();
  };

  const onReverseChange = (checked: boolean) => {
    setIsReverse(checked);
    setFlashcardIndex(0);
    flashcardRef.current?.reset();
    setWasFlipped(false);
  };

  const tally = useMemo(() => {
    const counts: Record<Direction, number> = {
      left: 0,
      down: 0,
      right: 0,
      up: 0,
    };
    for (const rating of sessionHistory) {
      for (const direction of FLASHCARD_DIRECTIONS) {
        if (FLASHCARD_DIRECTION_RATINGS[direction] === rating) {
          counts[direction] += 1;
        }
      }
    }
    return counts;
  }, [sessionHistory]);

  const ratingLabels: Record<Direction, string> = {
    left: !wasFlipped ? t("flashcards.dontKnow") : t("flashcards.didntKnow"),
    down: !wasFlipped ? t("flashcards.notSure") : t("flashcards.wasntSure"),
    right: !wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt"),
    up: t("flashcards.easy"),
  };

  return (
    <div className="flex w-full flex-col self-stretch">
      <h1 className="text-3xl">{t("flashcards.title")}</h1>

      <p className="text-muted-foreground short:hidden font-semibold">
        {t("flashcards.practiceYourWords")}
      </p>

      <div className="max-lg:short:gap-2 mx-auto mt-6 flex w-full max-w-250 gap-5 max-lg:mt-4 max-lg:flex-col max-lg:gap-3 lg:mx-0">
        <aside className="max-lg:short:gap-2 flex w-full flex-col gap-4 max-lg:mx-auto max-lg:max-w-120 max-lg:gap-3 lg:w-60 lg:shrink-0">
          <section className="bg-card flex flex-col gap-3 rounded-xl border p-4 max-lg:gap-2 max-lg:py-3">
            <SectionLabel>{t("flashcards.deck")}</SectionLabel>

            <div className="flex flex-col gap-3 max-lg:flex-row max-lg:flex-wrap max-lg:items-center max-lg:gap-2">
              <LanguagePairSelector
                className="flex-1 lg:w-full"
                value={languagePair}
                onChange={(newPair) => onLanguagePairChange(newPair)}
                disabled={areButtonsDisabled}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckboxButton
                    className="justify-start"
                    label={t("flashcards.reverseCards")}
                    checked={isReverse}
                    onCheckedChange={(checked) => onReverseChange(!!checked)}
                    disabled={areButtonsDisabled}
                  />
                </TooltipTrigger>

                <TooltipContent>
                  <p>{t("flashcards.reverseCardsTooltip")}</p>
                </TooltipContent>
              </Tooltip>

              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(true)}
                disabled={areButtonsDisabled || !flashcard}
              >
                <IconPencil />
                <span className="max-lg:hidden">
                  {t("flashcards.editTranslation")}
                </span>
              </Button>
            </div>
          </section>

          <section className="bg-card hidden flex-col gap-2 rounded-xl border p-4 lg:flex lg:flex-1 lg:justify-between">
            <SectionLabel>{t("flashcards.shortcuts")}</SectionLabel>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("flashcards.flipCard")}
              </span>
              <Kbd>Space</Kbd>
            </div>

            {FLASHCARD_DIRECTIONS.map((direction) => (
              <div
                key={direction}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {ratingLabels[direction]}
                </span>
                <Kbd>{FLASHCARD_RATING_META[direction].kbd}</Kbd>
              </div>
            ))}
          </section>
        </aside>

        <aside className="flex w-full flex-col max-lg:mx-auto max-lg:max-w-120 lg:order-last lg:w-60 lg:shrink-0">
          <SessionPanel
            reviewedCount={sessionHistory.length}
            remainingCount={flashcard?.remainingCount ?? lastRemainingCount}
            tally={tally}
            ratingLabels={ratingLabels}
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="max-lg:short:gap-2 mx-auto flex w-full max-w-120 flex-col gap-4 max-lg:gap-3">
            {isLoading ? (
              <FlashcardSkeleton />
            ) : error || !flashcard ? (
              <div className="bg-card flex h-58 flex-col items-center justify-center gap-2 rounded-xl border p-8 text-center md:h-70 lg:h-80">
                {!error ? (
                  <>
                    <h2 className="text-xl whitespace-pre-line">
                      {t("flashcards.congratulations")}
                    </h2>

                    <p className="text-muted-foreground max-w-md">
                      {t("flashcards.keepPracticing")}
                    </p>
                  </>
                ) : (
                  <h2 className="text-xl whitespace-pre-line">
                    {t("flashcards.errorLoadingFlashcard")}
                  </h2>
                )}

                <Button
                  className="mt-2"
                  variant="outline"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  <IconRefresh className={cn(isFetching && "animate-spin")} />

                  {t("flashcards.refresh")}
                </Button>
              </div>
            ) : (
              flashcard.translation && (
                <FlashcardComp
                  className="-m-1"
                  key={`${flashcardIndex}-${isReverse}`}
                  ref={flashcardRef}
                  isLoading={isFetching}
                  translation={flashcard.translation}
                  disabled={areButtonsDisabled}
                  isReverse={isReverse}
                  onAnimationStateChange={setIsCardAnimating}
                  onFlipStateChange={setWasFlipped}
                  onRespond={(direction) => {
                    void handleRespond(direction);
                  }}
                  onSwipeAnimationStart={() => setIsSwipeAnimating(true)}
                  onSwipeAnimationComplete={onSwipeAnimationComplete}
                  setEditDialogOpen={setEditDialogOpen}
                />
              )
            )}

            {isLoading ? (
              <FlashcardResponseButtonsSkeleton />
            ) : (
              <div
                className={cn(
                  "bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border transition-opacity sm:grid-cols-4",
                  !flashcard && "pointer-events-none opacity-0",
                )}
              >
                {FLASHCARD_DIRECTIONS.map((direction) => {
                  const meta = FLASHCARD_RATING_META[direction];
                  const Icon = meta.icon;

                  return (
                    <button
                      key={direction}
                      className={cn(
                        "bg-card max-lg:short:py-2 flex cursor-pointer flex-col items-center gap-1 px-2 py-3 transition-colors disabled:pointer-events-none disabled:opacity-50",
                        meta.hoverClass,
                        meta.mobileOrderClass,
                      )}
                      onClick={() => flashcardRef.current?.respond(direction)}
                      disabled={areButtonsDisabled}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <Icon size={18} className={meta.iconClass} />
                        {ratingLabels[direction]}
                      </span>

                      <ReviewTimeDisplay
                        minutes={flashcard?.[meta.timeKey] ?? 0}
                        className={cn(
                          "text-xs",
                          isSwipeAnimating && "opacity-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {!!flashcard && (
          <AddEditWordDialog
            open={editDialogOpen}
            onOpenChange={(open) => setEditDialogOpen(open)}
            editMode={true}
            currentTranslation={flashcard.translation}
            flashcardQueryKey={["flashcards", flashcardParams, flashcardIndex]}
            onDeleted={() => flashcardRef.current?.reset()}
          />
        )}
      </div>
    </div>
  );
};
