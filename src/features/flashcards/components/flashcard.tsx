"use client";

import { Kbd } from "@/components/ui/kbd";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { Flashcard } from "@/interfaces/flashcard.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";
import {
  IconArrowRight,
  IconHandClick,
  IconLanguage,
} from "@tabler/icons-react";
import { useEffect } from "react";

type FlashcardCompProps = {
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  flashcard: Flashcard;
  flipped: boolean;
  animationPlaying: boolean;
  swipeAnimationDirection: "left" | "right" | null;
  isCardRefreshing: boolean;
  startFlip: () => void;
  onKeyDown?: (e: globalThis.KeyboardEvent) => void;
};

type FlashcardSideProps = {
  flashcard: Flashcard;
  isFront: boolean;
  flipped: boolean;
  flipAnimationPlaying: boolean;
  swipeAnimationDirection?: "left" | "right" | null;
};

const FlashcardSide = ({
  flashcard,
  isFront,
  flipped,
  flipAnimationPlaying,
  swipeAnimationDirection,
}: FlashcardSideProps) => {
  const isMobile = useIsMobileScreen();

  return (
    <div
      className={cn(
        "absolute inset-0 bg-primary text-primary-foreground rounded-xl [backface-visibility:hidden]",
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

          <div className="absolute left-0 bottom-5 w-full text-center text-primary-muted-foreground">
            {!isMobile ? (
              <div>
                Click on the card or press{" "}
                <Kbd className="bg-muted/50">Space</Kbd> to flip it
              </div>
            ) : (
              <p className="flex justify-center items-center gap-1.5">
                Tap on the card to flip it <IconHandClick />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlashcardComp = ({
  className,
  ref,
  flashcard,
  flipped,
  animationPlaying,
  swipeAnimationDirection,
  isCardRefreshing,
  startFlip,
  onKeyDown,
}: FlashcardCompProps) => {
  useEffect(() => {
    if (!onKeyDown) return;
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className={cn("select-none", className)} ref={ref}>
      <div
        className={cn(
          "relative rounded-xl h-60 ring-2 hover:scale-102 cursor-pointer transition-all [transform-style:preserve-3d]",
          animationPlaying && "duration-1000 hover:scale-100",
          swipeAnimationDirection &&
            "duration-700 hover:scale-100 translate-y-4",
          swipeAnimationDirection === "left" && "-translate-x-96 -rotate-5",
          swipeAnimationDirection === "right" && "translate-x-96 rotate-5",
          flipped && "[transform:rotateY(180deg)]",
          isCardRefreshing && "duration-0",
        )}
        onClick={() => startFlip()}
      >
        <FlashcardSide
          flashcard={flashcard}
          isFront={true}
          flipped={flipped}
          flipAnimationPlaying={animationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
        />

        <FlashcardSide
          flashcard={flashcard}
          isFront={false}
          flipped={flipped}
          flipAnimationPlaying={animationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
        />
      </div>

      <div className="-mt-57 h-60 w-full rounded-xl ring-2 bg-primary"></div>

      <div className="-mt-61.5 h-60 w-full rounded-xl ring-2 bg-primary"></div>
    </div>
  );
};
