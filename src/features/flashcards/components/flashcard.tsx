"use client";

import {
  IconArrowRight,
  IconChevronDown,
  IconHandClick,
  IconLanguage,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { type Flashcard } from "@/interfaces/flashcard.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";

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
  const { getLanguage } = useLanguages();

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
        "bg-primary text-primary-foreground ring-foreground absolute inset-0 rounded-xl p-2 ring-2 ease-in [backface-visibility:hidden]",
        !isFront && "[transform:rotateY(180deg)]",
        ((isFront && !flipped) || (!isFront && flipped)) &&
          swipeAnimationDirection &&
          "opacity-0 transition-opacity duration-700",
        swipeAnimationDirection && flipped && isFront && "opacity-0",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col items-center justify-center",
          flipped && isFront && !flipAnimationPlaying && "opacity-0",
        )}
      >
        <div className="relative text-center">
          <div className="mx-auto flex w-fit">
            <IconLanguage className="my-auto mr-1" />

            <p className="my-auto text-sm">
              {
                LANGUAGES[
                  isFront
                    ? getLanguage(flashcard.translation.sourceLanguageId)
                        ?.code || ""
                    : getLanguage(flashcard.translation.translationLanguageId)
                        ?.code || ""
                ]
              }
            </p>

            <IconArrowRight className="mx-2 mt-1.5" size={16} />

            <p className="my-auto text-sm">
              {
                LANGUAGES[
                  isFront
                    ? getLanguage(flashcard.translation.translationLanguageId)
                        ?.code || ""
                    : getLanguage(flashcard.translation.sourceLanguageId)
                        ?.code || ""
                ]
              }
            </p>
          </div>

          <p className="line-clamp-3 text-xl" ref={textRef}>
            {isFront
              ? flashcard.translation.word.word
              : flashcard.translation.translations
                  .map((t) => t.word)
                  .join(", ")}
          </p>

          {!isFront && (isClamped || !!flashcard.translation.definition) && (
            <Button
              className="hover:bg-primary! absolute top-full left-1/2 -translate-x-1/2"
              variant="ghost"
              size="icon"
              onClick={handleEditButtonClicked}
            >
              <IconChevronDown className="mt-0.5" />
            </Button>
          )}
        </div>

        <div className="text-primary-muted-foreground absolute bottom-0 w-full text-center text-sm">
          {!isMobile ? (
            <div>
              Click on the card or press{" "}
              <Kbd className="bg-muted/50">Space</Kbd> to see the translation(s)
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5">
              Tap on the card to see the translation(s) <IconHandClick />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type FlashcardCompProps = {
  className?: string;
  ref?: React.Ref<HTMLDivElement | null>;
  flashcard: Flashcard;
  flipped: boolean;
  animationPlaying: boolean;
  swipeAnimationDirection: "left" | "right" | null;
  isCardRefreshing: boolean;
  startFlip: () => void;
  onKeyDown?: (e: globalThis.KeyboardEvent) => void;
  setEditDialogOpen?: (open: boolean) => void;
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
          "relative h-60 cursor-pointer rounded-xl transition-all ease-out [transform-style:preserve-3d] hover:scale-102",
          animationPlaying && "duration-1000",
          swipeAnimationDirection &&
            "translate-y-4 duration-700 hover:scale-100",
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

      <div className="bg-primary -mt-57 h-60 w-full rounded-xl ring-2" />

      <div className="bg-primary -mt-61.5 h-60 w-full rounded-xl ring-2" />
    </div>
  );
};
