"use client";

import {
  IconCheck,
  IconHandMove,
  IconHelp,
  IconPencil,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { CheckboxButton } from "@/components/ui/checkbox-button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
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
import ReviewTimeDisplay from "@/features/flashcards/components/review-time-display";
import {
  FLASHCARD_DIRECTION_RATINGS,
  FLASHCARD_FILTERS_STATE_STORAGE_KEY,
} from "@/features/flashcards/constants";
import type {
  Direction,
  FlashcardCompHandle,
} from "@/features/flashcards/types";
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

export const FlashcardsPage = () => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const flashcardRef = useRef<FlashcardCompHandle | null>(null);

  const storedFiltersState = useMemo(() => {
    if (typeof window === "undefined") return null;
    const storedState = window.localStorage.getItem(
      FLASHCARD_FILTERS_STATE_STORAGE_KEY,
    );

    if (!storedState) return null;

    try {
      return JSON.parse(storedState) as FlashcardParams;
    } catch (error) {
      console.error("Error parsing stored flashcard filters state:", error);
      return null;
    }
  }, []);

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(() => {
    if (storedFiltersState) {
      return {
        sourceLanguageId: storedFiltersState.sourceLanguageId ?? null,
        targetLanguageId: storedFiltersState.targetLanguageId ?? null,
      } satisfies LanguagePair;
    }
    return null;
  });
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

  const flashcardParams = useMemo<FlashcardParams>(() => {
    const params = {
      sourceLanguageId: languagePair?.sourceLanguageId,
      targetLanguageId: languagePair?.targetLanguageId,
      isReverse,
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        FLASHCARD_FILTERS_STATE_STORAGE_KEY,
        JSON.stringify(params),
      );
    }

    return params;
  }, [languagePair, isReverse]);

  const {
    data: flashcard,
    isFetching,
    error,
  } = useFlashcard(flashcardParams, flashcardIndex);
  const respondToFlashcard = useRespondToFlashcard(flashcardIndex);

  const areButtonsDisabled =
    isCardAnimating || respondToFlashcard.isPending || editDialogOpen;

  const handleRespondByRating = useCallback(
    async (response: 1 | 2 | 3 | 4) => {
      if (isCardAnimating || respondToFlashcard.isPending || !flashcard) {
        return;
      }

      await respondToFlashcard.mutateAsync({
        flashcardId: flashcard.id,
        response: {
          response,
          nextCardQuery: flashcardParams,
        },
      });
    },
    [isCardAnimating, respondToFlashcard, flashcard, flashcardParams],
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

  const onLanguagePairChange = (newPair: LanguagePair | null) => {
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

  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:w-120">
      <div className="flex">
        <div className="flex gap-2">
          <LanguagePairSelector
            className="w-fit"
            value={languagePair}
            onChange={(newPair) => onLanguagePairChange(newPair)}
            disabled={areButtonsDisabled}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <CheckboxButton
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
        </div>

        <Button
          className="ml-auto"
          variant="outline"
          onClick={() => setEditDialogOpen(true)}
          disabled={areButtonsDisabled || !flashcard}
        >
          <IconPencil />
          {t("general.edit")}
        </Button>
      </div>

      {error || !flashcard ? (
        <div className="bg-muted text-primary-foreground ring-foreground mb-10 flex h-60 w-full flex-col items-center justify-center gap-1 rounded-xl p-6 text-center ring-2">
          {!error ? (
            <>
              <p className="text-xl font-semibold whitespace-pre-line">
                {t("flashcards.congratulations")}
              </p>

              <p className="text-muted-foreground">
                {t("flashcards.keepPracticing")}
              </p>
            </>
          ) : (
            <p className="text-xl font-semibold whitespace-pre-line">
              {t("flashcards.errorLoadingFlashcard")}
            </p>
          )}
        </div>
      ) : (
        flashcard.translation && (
          <FlashcardComp
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

      <div
        className={cn(
          "mx-auto -mt-4 grid w-full grid-cols-2 gap-3 transition-opacity max-sm:p-2 sm:mt-1 sm:grid-cols-4 md:gap-2",
          !flashcard && "pointer-events-none opacity-0",
        )}
      >
        <div className="order-3 flex flex-col items-center gap-1 sm:order-none">
          <Kbd className="mb-1 hidden sm:inline-flex">◀</Kbd>
          <Button
            className="flex w-full"
            variant="outline"
            onClick={() => flashcardRef.current?.respond("left")}
            disabled={areButtonsDisabled}
          >
            <IconX className="text-destructive mt-0.5" />

            <p>
              {!wasFlipped
                ? t("flashcards.dontKnow")
                : t("flashcards.didntKnow")}
            </p>
          </Button>

          <ReviewTimeDisplay
            minutes={flashcard?.dontKnowNextReviewMinutes ?? 0}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>

        <div className="order-1 flex flex-col items-center gap-1 sm:order-none">
          <Kbd className="mb-1 hidden sm:inline-flex">▼</Kbd>
          <Button
            className="flex w-full"
            variant="outline"
            onClick={() => flashcardRef.current?.respond("down")}
            disabled={areButtonsDisabled}
          >
            <IconHelp className="text-muted-foreground mt-0.5" />

            <p>
              {!wasFlipped
                ? t("flashcards.notSure")
                : t("flashcards.wasntSure")}
            </p>
          </Button>

          <ReviewTimeDisplay
            minutes={flashcard?.notSureNextReviewMinutes ?? 0}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>

        <div className="order-4 flex flex-col items-center gap-1 sm:order-none">
          <Kbd className="mb-1 hidden sm:inline-flex">▶</Kbd>
          <Button
            className="flex w-full"
            variant="outline"
            onClick={() => flashcardRef.current?.respond("right")}
            disabled={areButtonsDisabled}
          >
            <IconCheck className="text-success mt-0.5" />

            <p>
              {!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}
            </p>
          </Button>

          <ReviewTimeDisplay
            minutes={flashcard?.knowItNextReviewMinutes ?? 0}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>

        <div className="order-2 flex flex-col items-center gap-1 sm:order-none">
          <Kbd className="mb-1 hidden sm:inline-flex">▲</Kbd>
          <Button
            className="flex w-full"
            variant="outline"
            onClick={() => flashcardRef.current?.respond("up")}
            disabled={areButtonsDisabled}
          >
            <IconStar className="mt-0.5 text-amber-500" />

            <p>{t("flashcards.easy")}</p>
          </Button>

          <ReviewTimeDisplay
            minutes={flashcard?.easyNextReviewMinutes ?? 0}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>
      </div>

      {!isMobile ? (
        <p
          className={cn(
            "text-muted-foreground/70 mx-auto text-center text-sm transition-opacity",
            !flashcard && "pointer-events-none opacity-0",
          )}
        >
          {t.rich("flashcards.hintUseArrowKeysOrSwipe", {
            left: (chunks) => <Kbd>{chunks}</Kbd>,
            up: (chunks) => <Kbd>{chunks}</Kbd>,
            down: (chunks) => <Kbd>{chunks}</Kbd>,
            right: (chunks) => <Kbd>{chunks}</Kbd>,
          })}
        </p>
      ) : (
        <p
          className={cn(
            "text-muted-foreground/70 mx-auto flex gap-1.5 text-center text-sm transition-opacity",
            !flashcard && "pointer-events-none opacity-0",
          )}
        >
          {t.rich("flashcards.hintTrySwiping", {
            hand: () => <IconHandMove />,
          })}
        </p>
      )}

      {!!flashcard && (
        <AddEditWordDialog
          open={editDialogOpen}
          onOpenChange={(open) => setEditDialogOpen(open)}
          editMode={true}
          currentTranslation={flashcard.translation}
          flashcardQueryKey={["flashcards", flashcardParams, flashcardIndex]}
        />
      )}
    </div>
  );
};
