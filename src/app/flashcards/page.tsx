"use client";

import {
  IconCheck,
  IconHandMove,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { useFlashcardSuspense } from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
import { FlashcardComp } from "@/features/flashcards/components/flashcard";
import { useDetectSwipeOnElement } from "@/hooks/use-detect-swipe-on-element";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { type Flashcard } from "@/interfaces/flashcard.interface";
import { type LanguagePair } from "@/interfaces/language-pair.interface";

const Flashcards = () => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { ref, swipeDirection, resetSwipeDirection } =
    useDetectSwipeOnElement<HTMLDivElement>();

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(
    null,
  );
  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [swipeAnimationDirection, setSwipeAnimationDirection] = useState<
    "left" | "right" | null
  >(null);
  const [cardRefreshing, setCardRefreshing] = useState(true);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: flashcard,
    isLoading,
    error,
  } = useFlashcardSuspense(languagePair);
  const respondToFlashcard = useRespondToFlashcard();

  const startFlip = () => {
    if (animationPlaying || swipeAnimationDirection) return;

    setFlipped(!flipped);
    setWasFlipped(true);
    setAnimationPlaying(true);
    setTimeout(() => {
      setAnimationPlaying(false);
    }, 1000);
  };

  const onKeyDown = (e: globalThis.KeyboardEvent) => {
    switch (e.key) {
      case " ":
        e.preventDefault();
        startFlip();
        break;
      case "ArrowLeft":
        e.preventDefault();
        void sendResponse(false);
        break;
      case "ArrowRight":
        e.preventDefault();
        void sendResponse(true);
        break;
    }
  };

  const refreshCard = () => {
    setCardRefreshing(true);
    setSwipeAnimationDirection(null);
    setFlipped(false);
    setWasFlipped(false);
  };

  const sendResponse = useCallback(
    (knewIt: boolean) => {
      if (
        cardRefreshing ||
        animationPlaying ||
        swipeAnimationDirection ||
        !flashcard
      )
        return;

      void respondToFlashcard.mutateAsync({
        flashcardId: flashcard.id,
        response: { knewIt },
      });

      setSwipeAnimationDirection(knewIt ? "right" : "left");
      setAreButtonsDisabled(true);
      setTimeout(() => {
        refreshCard();
        setAreButtonsDisabled(false);
      }, 680);
    },
    [
      flashcard,
      animationPlaying,
      cardRefreshing,
      swipeAnimationDirection,
      respondToFlashcard,
    ],
  );

  const onLanguagePairChange = (newPair: LanguagePair | null) => {
    // TODO: better way to reset the flashcard state
    setLanguagePair(newPair);
    setTimeout(() => {
      refreshCard();
    }, 150);
  };

  useEffect(() => {
    if (!isLoading && flashcard && cardRefreshing) {
      setCurrentFlashcard(flashcard);
      setCardRefreshing(false);
    }
  }, [cardRefreshing, flashcard, isLoading]);

  useEffect(() => {
    if (swipeDirection === "left") {
      sendResponse(false);
    } else if (swipeDirection === "right") {
      sendResponse(true);
    }

    if (swipeDirection) {
      resetSwipeDirection();
      setAnimationPlaying(true);
      setTimeout(() => {
        setAnimationPlaying(false);
      }, 700);
    }
  }, [swipeDirection, resetSwipeDirection, sendResponse]);

  if (isLoading) return <div>Loading flashcard...</div>;
  if (error) return <div>Error loading flashcard</div>;
  if (!flashcard) return <div>No flashcards found</div>;

  return (
    <div className="mx-auto flex w-full flex-col gap-4 lg:w-120">
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
        >
          <IconPencil />
          {t("general.edit")}
        </Button>
      </div>

      {currentFlashcard && (
        <FlashcardComp
          ref={ref}
          flashcard={currentFlashcard}
          flipped={flipped}
          startFlip={startFlip}
          animationPlaying={animationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
          isCardRefreshing={cardRefreshing}
          onKeyDown={onKeyDown}
          setEditDialogOpen={setEditDialogOpen}
        />
      )}

      <div className="mx-auto mt-4 grid grid-cols-2 gap-10 px-10">
        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(false)}
          disabled={areButtonsDisabled}
        >
          <IconX className="text-destructive mt-0.5" />

          <p>
            {!wasFlipped ? t("flashcards.dontKnow") : t("flashcards.didntKnow")}
          </p>
        </Button>

        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(true)}
          disabled={areButtonsDisabled}
        >
          <IconCheck className="text-success mt-0.5" />

          <p>{!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}</p>
        </Button>
      </div>

      {!isMobile ? (
        <p className="text-muted-foreground/70 mx-auto text-center text-sm">
          Hint: try using the arrow keys (<Kbd>◀</Kbd> and <Kbd>▶</Kbd>), or
          swiping on the card to respond.
        </p>
      ) : (
        <p className="text-muted-foreground/70 mx-auto flex gap-1.5 text-center text-sm">
          Hint: try swiping on the card to respond <IconHandMove />
        </p>
      )}

      <AddEditWordDialog
        open={editDialogOpen}
        onOpenChange={(open) => setEditDialogOpen(open)}
        editMode={true}
        currentTranslation={flashcard.translation}
        onSave={() => setTimeout(() => refreshCard(), 150)}
      />
    </div>
  );
};

export default Flashcards;
