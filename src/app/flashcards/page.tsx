"use client";

import { FlashcardComp } from "@/app/flashcards/components/flashcard";
import { useFlashcard, useRespondToFlashcard } from "@/app/flashcards/hooks";
import { LanguagePairSelector } from "@/app/vocabulary/components/language-pair-selector";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePair } from "@/hooks/languages-hooks";
import { useDetectSwipeOnElement } from "@/hooks/use-detect-swipe-on-element";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { IconCheck, IconHandMove, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

export default function Flashcards() {
  const t = useI18n();
  const respondToFlashcard = useRespondToFlashcard();
  const isMobile = useIsMobileScreen();
  const { ref, swipeDirection, resetSwipeDirection } =
    useDetectSwipeOnElement<HTMLDivElement>();

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [swipeAnimationDirection, setSwipeAnimationDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isCardRefreshing, setIsCardRefreshing] = useState(false);

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
  }, [currentFlashcard, flashcard]);

  const startFlip = () => {
    if (animationPlaying || swipeDirection) return;

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
        sendResponse(false);
        break;
      case "ArrowRight":
        e.preventDefault();
        sendResponse(true);
        break;
    }
  };

  const sendResponse = useCallback(
    async (knewIt: boolean) => {
      if (isCardRefreshing || animationPlaying || !flashcard) return;

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

        setIsCardRefreshing(true);
        setCurrentFlashcard(flashcard);
        setTimeout(() => setIsCardRefreshing(false), 20);
      }, 700);
    },
    [
      flashcard,
      animationPlaying,
      isCardRefreshing,
      refetch,
      respondToFlashcard,
    ],
  );

  useEffect(() => {}, [languagePair]);

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
    <div className="flex flex-col mx-auto gap-4 lg:w-120">
      <LanguagePairSelector
        className="w-fit"
        value={languagePair}
        onChange={setLanguagePair}
      />

      {currentFlashcard && (
        <FlashcardComp
          ref={ref}
          flashcard={currentFlashcard}
          flipped={flipped}
          startFlip={startFlip}
          animationPlaying={animationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
          isCardRefreshing={isCardRefreshing}
          onKeyDown={onKeyDown}
        />
      )}

      <div className="grid grid-cols-2 gap-10 px-10 mx-auto mt-4">
        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(false)}
          disabled={isCardRefreshing}
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
          disabled={isCardRefreshing}
        >
          <IconCheck className="mt-0.5 text-success" />

          <p>{!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}</p>
        </Button>
      </div>

      {!isMobile ? (
        <p className="text-muted-foreground/70 mx-auto text-center">
          Hint: try using the arrow keys (<Kbd>◀</Kbd> and <Kbd>▶</Kbd>), or
          swiping on the card to respond.
        </p>
      ) : (
        <p className="flex gap-1.5 text-muted-foreground/70 mx-auto text-center">
          Hint: try swiping on the card to respond <IconHandMove />
        </p>
      )}
    </div>
  );
}
