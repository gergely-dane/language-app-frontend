"use client";
import { Flashcard } from "@/app/flashcards/hooks";
import { Kbd } from "@/components/ui/kbd";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconLanguage } from "@tabler/icons-react";
import { useEffect } from "react";

interface FlashcardCompProps {
  className?: string;
  flashcard: Flashcard;
  flipped: boolean;
  flipAnimationPlaying: boolean;
  swipeAnimationDirection: "left" | "right" | null;
  isSubmittingResponse: boolean;
  startFlip: () => void;
  onKeyDown?: (e: globalThis.KeyboardEvent) => void;
}

interface FlashcardSideProps {
  flashcard: Flashcard;
  isFront: boolean;
  flipped: boolean;
  flipAnimationPlaying: boolean;
  swipeAnimationDirection?: "left" | "right" | null;
}

function FlashcardSide({
  flashcard,
  isFront,
  flipped,
  flipAnimationPlaying,
  swipeAnimationDirection,
}: FlashcardSideProps) {
  const isMobile = useIsMobileScreen();

  return (
    <div
      className={cn(
        "absolute inset-0 bg-muted-foreground rounded-xl border border-black [backface-visibility:hidden]",
        !isFront && "[transform:rotateY(180deg)]",
        ((isFront && !flipped) || (!isFront && flipped)) &&
          swipeAnimationDirection &&
          "transition-opacity duration-700 opacity-0",
      )}
    >
      <div
        className={cn(
          "flex h-full",
          flipped && isFront && !flipAnimationPlaying && "opacity-0",
        )}
      >
        <div className="m-auto text-center">
          <div className="flex w-fit mx-auto">
            <IconLanguage className="my-auto mr-1" />
            <p className="text-sm my-auto">
              {
                LANGUAGES[
                  isFront
                    ? flashcard.translation.sourceLanguageCode
                    : flashcard.translation.translationLanguageCode
                ]
              }
            </p>
            <IconArrowRight className="mx-2 mt-1.5" size={16} />
            <p className="text-sm my-auto">
              {
                LANGUAGES[
                  isFront
                    ? flashcard.translation.translationLanguageCode
                    : flashcard.translation.sourceLanguageCode
                ]
              }
            </p>
          </div>
          <p className="text-xl">
            {isFront
              ? flashcard.translation.word.word
              : flashcard.translation.translations[0].word}
          </p>
          <div className="absolute left-0 bottom-5 w-full text-muted/40">
            {!isMobile ? (
              <div>
                Click on the card or press{" "}
                <Kbd className="bg-muted/40">Space</Kbd> to flip it
              </div>
            ) : (
              <p>Tap on the card to flip it</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlashcardComp({
  className,
  flashcard,
  flipped,
  flipAnimationPlaying,
  swipeAnimationDirection,
  isSubmittingResponse,
  startFlip,
  onKeyDown,
}: FlashcardCompProps) {
  useEffect(() => {
    if (!onKeyDown) return;
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className={cn("select-none", className)}>
      <div
        className={cn(
          "relative rounded-xl h-60 hover:scale-102 cursor-pointer transition-all [transform-style:preserve-3d]",
          flipAnimationPlaying && "duration-1000 hover:scale-100",
          swipeAnimationDirection && "duration-700 hover:scale-100",
          swipeAnimationDirection === "left" && "-translate-x-96 -rotate-5",
          swipeAnimationDirection === "right" && "translate-x-96 rotate-5",
          flipped && "[transform:rotateY(180deg)]",
          isSubmittingResponse && "duration-0",
        )}
        onClick={() => startFlip()}
      >
        <FlashcardSide
          flashcard={flashcard}
          isFront={true}
          flipped={flipped}
          flipAnimationPlaying={flipAnimationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
        />
        <FlashcardSide
          flashcard={flashcard}
          isFront={false}
          flipped={flipped}
          flipAnimationPlaying={flipAnimationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
        />
      </div>
      <div className="-mt-57 h-60 w-full rounded-xl bg-muted-foreground border border-black"></div>
      <div className="-mt-61.5 h-60 w-full rounded-xl bg-muted-foreground border border-black"></div>
    </div>
  );
}
