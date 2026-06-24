"use client";

import {
  IconCheck,
  IconHandMove,
  IconHelp,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { useFlashcard } from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
import { FlashcardComp } from "@/features/flashcards/components/flashcard";
import ReviewTimeDisplay from "@/features/flashcards/components/review-time-display";
import type {
  Direction,
  FlashcardCompHandle,
} from "@/features/flashcards/types";
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

const Flashcards = () => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const flashcardRef = useRef<FlashcardCompHandle | null>(null);

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: flashcard,
    isLoading,
    error,
  } = useFlashcard(languagePair, flashcardIndex);
  const respondToFlashcard = useRespondToFlashcard(flashcardIndex);

  const areButtonsDisabled =
    isCardAnimating || respondToFlashcard.isPending || editDialogOpen;

  const handleRespond = useCallback(
    async (direction: Direction) => {
      if (isCardAnimating || respondToFlashcard.isPending || !flashcard) {
        return;
      }

      let response: 1 | 2 | 3;
      if (direction === "left") response = 1;
      else if (direction === "down") response = 2;
      else response = 3;

      await respondToFlashcard.mutateAsync({
        translationId: flashcard.translation.id,
        response: {
          response,
          nextCardQuery: languagePair,
        },
      });

      if (response === 2) {
        setFlashcardIndex((prev) => prev + 1);
        flashcardRef.current?.reset();
      }
    },
    [isCardAnimating, respondToFlashcard, flashcard, languagePair],
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

  if (isLoading) return <p>{t("flashcards.loadingFlashcard")}</p>;
  if (error) return <p>{t("flashcards.errorLoadingFlashcard")}</p>;
  if (!flashcard) return <p>{t("flashcards.noFlashcardsFound")}</p>;

  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:w-120">
      <div className="flex">
        <LanguagePairSelector
          className="w-fit"
          value={languagePair}
          onChange={(newPair) => onLanguagePairChange(newPair)}
          disabled={areButtonsDisabled}
        />

        <Button
          className="ml-auto"
          variant="outline"
          onClick={() => setEditDialogOpen(true)}
          disabled={areButtonsDisabled}
        >
          <IconPencil />
          {t("general.edit")}
        </Button>
      </div>

      {flashcard?.translation && (
        <FlashcardComp
          key={flashcardIndex}
          ref={flashcardRef}
          translation={flashcard.translation}
          disabled={areButtonsDisabled}
          onAnimationStateChange={setIsCardAnimating}
          onFlipStateChange={setWasFlipped}
          onRespond={(direction) => {
            void handleRespond(direction);
          }}
          onSwipeAnimationStart={() => setIsSwipeAnimating(true)}
          onSwipeAnimationComplete={onSwipeAnimationComplete}
          setEditDialogOpen={setEditDialogOpen}
        />
      )}

      <div className="mx-auto mt-4 grid grid-cols-3 gap-3 md:gap-6 md:px-8">
        <div className="flex flex-col items-center gap-1">
          <Button
            className="flex w-28 sm:w-32"
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
            minutes={flashcard.dontKnowNextReviewMinutes}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            className="flex w-28 sm:w-32"
            variant="outline"
            onClick={() => void handleRespond("down")}
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
            minutes={flashcard.notSureNextReviewMinutes}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            className="flex w-28 sm:w-32"
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
            minutes={flashcard.knowItNextReviewMinutes}
            className={cn(isSwipeAnimating && "opacity-0")}
          />
        </div>
      </div>

      {!isMobile ? (
        <p className="text-muted-foreground/70 mx-auto text-center text-sm">
          {t.rich("flashcards.hintUseArrowKeysOrSwipe", {
            left: (chunks) => <Kbd>{chunks}</Kbd>,
            down: (chunks) => <Kbd>{chunks}</Kbd>,
            right: (chunks) => <Kbd>{chunks}</Kbd>,
          })}
        </p>
      ) : (
        <p className="text-muted-foreground/70 mx-auto flex gap-1.5 text-center text-sm">
          {t.rich("flashcards.hintTrySwiping", {
            hand: () => <IconHandMove />,
          })}
        </p>
      )}

      <AddEditWordDialog
        open={editDialogOpen}
        onOpenChange={(open) => setEditDialogOpen(open)}
        editMode={true}
        currentTranslation={flashcard.translation}
        flashcardQueryKey={["flashcards", languagePair, flashcardIndex]}
      />
    </div>
  );
};

export default Flashcards;
