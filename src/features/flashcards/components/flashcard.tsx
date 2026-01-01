"use client";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { Flashcard } from "@/interfaces/flashcard.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";
import {
  IconArrowRight,
  IconChevronDown,
  IconHandClick,
  IconLanguage,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

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
  setEditDialogOpen?: (open: boolean) => void;
};

type FlashcardSideProps = {
  flashcard: Flashcard;
  isFront: boolean;
  flipped: boolean;
  flipAnimationPlaying: boolean;
  swipeAnimationDirection?: "left" | "right" | null;
  setEditDialogOpen?: (open: boolean) => void;
};

const FlashcardSide = ({
  flashcard,
  isFront,
  flipped,
  flipAnimationPlaying,
  swipeAnimationDirection,
  setEditDialogOpen,
}: FlashcardSideProps) => {
  const isMobile = useIsMobileScreen();

  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [flashcard]);

  const handleEditButtonClicked = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (setEditDialogOpen) {
      setEditDialogOpen(true);
    }
  };

  return (
    <div
      className={cn(
        "absolute inset-0 bg-primary p-2 text-primary-foreground ring-foreground ring-2 rounded-xl ease-in [backface-visibility:hidden]",
        !isFront && "[transform:rotateY(180deg)]",
        ((isFront && !flipped) || (!isFront && flipped)) &&
          swipeAnimationDirection &&
          "transition-opacity duration-700 opacity-0",
        swipeAnimationDirection && flipped && isFront && "opacity-0",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center h-full",
          flipped && isFront && !flipAnimationPlaying && "opacity-0",
        )}
      >
        <div className="relative text-center">
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

          <p className="text-xl line-clamp-3" ref={textRef}>
            {isFront
              ? flashcard.translation.word.word
              : flashcard.translation.translations
                  .map((t) => t.word)
                  .join(", ")}
          </p>

          {!isFront && (isClamped || !!flashcard.translation.definition) && (
            <Button
              className="absolute left-1/2 top-full -translate-x-1/2 hover:bg-primary!"
              variant="ghost"
              size="icon"
              onClick={handleEditButtonClicked}
            >
              <IconChevronDown className="mt-0.5" />
            </Button>
          )}
        </div>

        <div className="absolute bottom-0 w-full text-center text-primary-muted-foreground text-sm">
          {!isMobile ? (
            <div>
              Click on the card or press{" "}
              <Kbd className="bg-muted/50">Space</Kbd> to see the translation(s)
            </div>
          ) : (
            <div className="flex justify-center items-center gap-1.5">
              Tap on the card to see the translation(s) <IconHandClick />
            </div>
          )}
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
  setEditDialogOpen,
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
          "relative rounded-xl h-60 hover:scale-102 cursor-pointer transition-all ease-out [transform-style:preserve-3d]",
          animationPlaying && "duration-1000",
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
          setEditDialogOpen={setEditDialogOpen}
        />

        <FlashcardSide
          flashcard={flashcard}
          isFront={false}
          flipped={flipped}
          flipAnimationPlaying={animationPlaying}
          swipeAnimationDirection={swipeAnimationDirection}
          setEditDialogOpen={setEditDialogOpen}
        />
      </div>

      <div className="-mt-57 h-60 w-full rounded-xl ring-2 bg-primary"></div>

      <div className="-mt-61.5 h-60 w-full rounded-xl ring-2 bg-primary"></div>
    </div>
  );
};
