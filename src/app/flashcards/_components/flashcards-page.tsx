"use client";

import { IconPencil } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { CheckboxButton } from "@/components/common/checkbox-button";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CollapsibleSection } from "@/features/flashcards/components/collapsible-section";
import { FlashcardDeck } from "@/features/flashcards/components/flashcard-deck";
import { FlashcardEmptyState } from "@/features/flashcards/components/flashcard-empty-state";
import { FlashcardResponseButtons } from "@/features/flashcards/components/flashcard-response-buttons";
import {
  FlashcardResponseButtonsSkeleton,
  FlashcardSkeleton,
} from "@/features/flashcards/components/flashcard-skeleton";
import { PracticeModeSelector } from "@/features/flashcards/components/practice-mode-selector";
import { SectionLabel } from "@/features/flashcards/components/section-label";
import { SessionPanel } from "@/features/flashcards/components/session-panel";
import {
  DEFAULT_PRACTICE_MODE,
  FLASHCARD_DIRECTION_RATINGS,
  FLASHCARD_DIRECTIONS,
  FLASHCARD_RATING_META,
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
import { LanguagePairSelector } from "@/features/languages/components/language-pair-selector";
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
  const { sessionHistory, recordResponse } = useFlashcardSession();

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

  const deck = useFlashcardDeck(flashcardParams, recordResponse);
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

  const onReverseChange = (checked: boolean) => {
    setIsReverse(checked);
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
          <CollapsibleSection section="deck" title={t("flashcards.deck")}>
            <div className="flex items-center gap-2 lg:contents">
              <LanguagePairSelector
                className="flex-1 lg:w-full"
                value={languagePair}
                onChange={(newPair) => onLanguagePairChange(newPair)}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckboxButton
                    className="justify-start lg:order-last"
                    label={t("flashcards.reverseCards")}
                    checked={isReverse}
                    onCheckedChange={(checked) => onReverseChange(!!checked)}
                  />
                </TooltipTrigger>

                <TooltipContent>
                  <p>{t("flashcards.reverseCardsTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2 lg:contents">
              <PracticeModeSelector
                className="flex-1 lg:w-full"
                value={practiceMode}
                onChange={onPracticeModeChange}
              />

              <Button
                className="lg:order-last"
                variant="outline"
                onClick={onEditClick}
                disabled={!deck.flashcard}
              >
                <IconPencil />
                <span className="max-lg:hidden">
                  {t("flashcards.editTranslation")}
                </span>
              </Button>
            </div>
          </CollapsibleSection>

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
            remainingCount={getRemainingCount(lastCounts, practiceMode)}
            practiceMode={practiceMode}
            tally={tally}
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-120 flex-col gap-4 max-lg:gap-3">
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
                setEditDialogOpen={setEditDialogOpen}
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
