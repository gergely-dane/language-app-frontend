"use client";

import { useEffect, useMemo, useState } from "react";

import { DeckPanel } from "@/features/flashcards/components/deck-panel";
import { FlashcardDeck } from "@/features/flashcards/components/flashcard-deck";
import { FlashcardEmptyState } from "@/features/flashcards/components/flashcard-empty-state";
import { FlashcardResponseButtons } from "@/features/flashcards/components/flashcard-response-buttons";
import {
  FlashcardResponseButtonsSkeleton,
  FlashcardSkeleton,
} from "@/features/flashcards/components/flashcard-skeleton";
import { FlashcardToolbar } from "@/features/flashcards/components/flashcard-toolbar";
import { SessionPanel } from "@/features/flashcards/components/session-panel";
import { ShortcutsPanel } from "@/features/flashcards/components/shortcuts-panel";
import {
  DEFAULT_PRACTICE_MODE,
  FLASHCARD_DIRECTION_RATINGS,
  FLASHCARD_DIRECTIONS,
} from "@/features/flashcards/constants";
import { useFlashcardDeck } from "@/features/flashcards/hooks/use-flashcard-deck";
import { useFlashcardSession } from "@/features/flashcards/hooks/use-flashcard-session";
import { useFlashcardShortcuts } from "@/features/flashcards/hooks/use-flashcard-shortcuts";
import type {
  Direction,
  FlashcardParams,
  PracticeMode,
} from "@/features/flashcards/types";
import {
  getRemainingCount,
  getStoredFlashcardFilters,
  storeFlashcardFilters,
} from "@/features/flashcards/utils";
import { useLanguages } from "@/features/languages/api/get-languages";
import { type LanguageFilterValue } from "@/features/languages/types";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit/add-edit-word-dialog";
import { useI18n } from "@/hooks/use-i18n";

export const FlashcardsPage = () => {
  const t = useI18n();

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
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(
    () => storedFiltersState?.practiceMode ?? DEFAULT_PRACTICE_MODE,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { sessionHistory, recordResponse, undoResponse } =
    useFlashcardSession();

  const flashcardParams = useMemo<FlashcardParams>(
    () => ({
      sourceLanguageId: languagePair?.sourceLanguageId,
      targetLanguageId: languagePair?.targetLanguageId,
      isReverse,
      practiceMode,
    }),
    [languagePair, isReverse, practiceMode],
  );

  useEffect(() => {
    storeFlashcardFilters(flashcardParams);
  }, [flashcardParams]);

  const deck = useFlashcardDeck(flashcardParams, recordResponse, undoResponse);
  const { isLoading: isLanguagesLoading } = useLanguages();
  const isLoading = deck.isLoading || isLanguagesLoading;

  useFlashcardShortcuts({
    enabled: !editDialogOpen,
    onFlip: deck.flip,
    onRespond: deck.respond,
  });

  const [lastCounts, setLastCounts] = useState({
    newCount: 0,
    existingCount: 0,
  });
  const settledCounts = deck.isLoading
    ? null
    : {
        newCount: deck.queue?.newCount ?? 0,
        existingCount: deck.queue?.existingCount ?? 0,
      };
  if (
    settledCounts !== null &&
    (settledCounts.newCount !== lastCounts.newCount ||
      settledCounts.existingCount !== lastCounts.existingCount)
  ) {
    setLastCounts(settledCounts);
  }

  const onLanguagePairChange = (newPair: LanguageFilterValue | null) => {
    setLanguagePair(newPair);
    deck.redeal();
  };

  const onReverseChange = (newIsReverse: boolean) => {
    setIsReverse(newIsReverse);
    deck.redeal();
  };

  const onPracticeModeChange = (newMode: PracticeMode) => {
    setPracticeMode(newMode);
    deck.redeal();
  };

  const onEditClick = () => {
    if (deck.dealtCard) setEditDialogOpen(true);
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
    left: !deck.revealed ? t("flashcards.dontKnow") : t("flashcards.didntKnow"),
    down: !deck.revealed ? t("flashcards.notSure") : t("flashcards.wasntSure"),
    right: !deck.revealed ? t("flashcards.knowIt") : t("flashcards.knewIt"),
    up: t("flashcards.easy"),
  };

  return (
    <div className="flex w-full flex-col self-stretch">
      <h1 className="text-3xl">{t("flashcards.title")}</h1>

      <p className="text-muted-foreground short:hidden font-semibold">
        {t("flashcards.practiceYourWords")}
      </p>

      <div className="mx-auto mt-6 flex w-full max-w-250 gap-5 max-lg:mt-4 max-lg:flex-col max-lg:gap-3 lg:mx-0">
        <aside className="max-lg:short:gap-2 flex w-full flex-col gap-4 max-lg:mx-auto max-lg:max-w-120 max-lg:gap-3 lg:w-60 lg:shrink-0">
          <DeckPanel
            languagePair={languagePair}
            practiceMode={practiceMode}
            isReverse={isReverse}
            onLanguagePairChange={onLanguagePairChange}
            onPracticeModeChange={onPracticeModeChange}
            onReverseChange={onReverseChange}
          />

          <ShortcutsPanel ratingLabels={ratingLabels} />
        </aside>

        <aside className="flex w-full flex-col max-lg:mx-auto max-lg:max-w-120 lg:order-last lg:w-60 lg:shrink-0">
          <SessionPanel
            reviewedCount={sessionHistory.length}
            remainingCount={getRemainingCount(lastCounts, practiceMode)}
            practiceMode={practiceMode}
            tally={tally}
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-120 flex-col gap-3.5 max-lg:gap-3">
            <FlashcardToolbar
              canUndo={deck.canUndo}
              canEdit={!!deck.flashcard}
              onUndo={deck.undo}
              onEdit={onEditClick}
            />

            {isLoading ? (
              <FlashcardSkeleton />
            ) : (
              <FlashcardDeck
                dealtCard={deck.dealtCard}
                flipped={deck.flipped}
                exitDirections={deck.exitDirections}
                stack={deck.stack}
                emptyState={
                  deck.isEmpty && (
                    <FlashcardEmptyState
                      hasError={!!deck.error}
                      practiceMode={practiceMode}
                      newCount={lastCounts.newCount}
                      existingCount={lastCounts.existingCount}
                      isRefreshing={deck.isFetching}
                      onRefresh={() => void deck.refetch()}
                      onPracticeModeChange={onPracticeModeChange}
                    />
                  )
                }
                onFlip={deck.flip}
                onSwipe={deck.respond}
                onExitComplete={deck.clearExitDirections}
                onCardEntered={deck.onCardEntered}
                isReverse={isReverse}
              />
            )}

            {isLoading ? (
              <FlashcardResponseButtonsSkeleton />
            ) : (
              <FlashcardResponseButtons
                flashcard={deck.flashcard}
                labels={ratingLabels}
                isHidden={!deck.flashcard}
                areTimesHidden={!deck.dealtCard}
                onRespond={deck.respond}
              />
            )}
          </div>
        </main>

        {!!deck.flashcard && (
          <AddEditWordDialog
            open={editDialogOpen}
            onOpenChange={(open) => setEditDialogOpen(open)}
            editMode={true}
            currentTranslation={deck.flashcard.translation}
            flashcardQueryKey={deck.flashcardQueryKey}
            onDeleted={deck.redeal}
            onProgressReset={deck.redeal}
          />
        )}
      </div>
    </div>
  );
};
