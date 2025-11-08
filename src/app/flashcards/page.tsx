"use client";

import { FlashcardComp } from "@/app/flashcards/components/flashcard";
import { useFlashcard, useRespondToFlashcard } from "@/app/flashcards/hooks";
import { LanguagePairSelector } from "@/app/vocabulary/components/language-pair-selector";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePair } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function Flashcards() {
  const t = useI18n();
  const respondToFlashcard = useRespondToFlashcard();
  const isMobile = useIsMobileScreen();

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);

  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [flipAnimationPlaying, setFlipAnimationPlaying] = useState(false);
  const [swipeAnimationDirection, setSwipeAnimationDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const {
    data: flashcard,
    isLoading,
    error,
    refetch,
  } = useFlashcard(languagePair);

  useEffect(() => {
    if (flashcard && !currentFlashcard) {
      setCurrentFlashcard(flashcard);
    }
  }, [flashcard]);

  if (isLoading) return <div>Loading flashcard...</div>;
  if (error) return <div>Error loading flashcard</div>;
  if (!flashcard) return <div>No flashcards found</div>;

  const startFlip = () => {
    if (flipAnimationPlaying) return;

    setFlipped(!flipped);
    setWasFlipped(true);
    setFlipAnimationPlaying(true);
    setTimeout(() => {
      setFlipAnimationPlaying(false);
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
        sendResponse(false);
        break;
      case "ArrowRight":
        e.preventDefault();
        sendResponse(true);
        break;
    }
  };

  const sendResponse = async (knewIt: boolean) => {
    if (isSubmittingResponse || flipAnimationPlaying) return;

    respondToFlashcard
      .mutateAsync({
        flashcardId: flashcard.id,
        response: { knewIt },
      })
      .then(() => refetch());

    setSwipeAnimationDirection(knewIt ? "right" : "left");
    setTimeout(async () => {
      setSwipeAnimationDirection(null);
      setFlipped(false);
      setWasFlipped(false);

      setIsSubmittingResponse(true);
      setCurrentFlashcard(flashcard);
      setTimeout(() => setIsSubmittingResponse(false), 20);
    }, 700);
  };

  return (
    <div className="flex flex-col mt-6 mx-auto gap-4 lg:w-120">
      <LanguagePairSelector
        className="mx-2 w-fit lg:mx-0"
        value={languagePair}
        onChange={setLanguagePair}
      />

      {currentFlashcard && (
        <FlashcardComp
          className="mx-2 lg:mx-0"
          flashcard={currentFlashcard}
          flipped={flipped}
          startFlip={startFlip}
          flipAnimationPlaying={flipAnimationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
          isSubmittingResponse={isSubmittingResponse}
          onKeyDown={onKeyDown}
        />
      )}

      <div className="grid grid-cols-2 gap-10 px-10 mx-auto mt-4">
        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(false)}
          disabled={isSubmittingResponse}
        >
          <IconX className="mt-0.5 text-destructive" />

          <p>
            {!wasFlipped ? t("flashcards.dontKnow") : t("flashcards.didntKnow")}
          </p>
        </Button>

        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(true)}
          disabled={isSubmittingResponse}
        >
          <IconCheck className="mt-0.5 text-success" />

          <p>{!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}</p>
        </Button>
      </div>

      {!isMobile && (
        <p className="text-muted-foreground/40 mx-auto text-center">
          Hint: you can use the arrow keys (<Kbd>◀</Kbd> and <Kbd>▶</Kbd>) to
          respond.
        </p>
      )}
    </div>
  );
}
