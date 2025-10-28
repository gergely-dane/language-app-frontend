"use client";
import { Flashcard } from "@/app/flashcards/hooks";
import { Kbd } from "@/components/ui/kbd";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconLanguage } from "@tabler/icons-react";
import { useEffect } from "react";

interface FlashcardCompProps {
  className?: string;
  flashcard: Flashcard;
  flipped: boolean;
  isSubmittingResponse: boolean;
  startFlip: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export function FlashcardComp({
  className,
  flashcard,
  flipped,
  isSubmittingResponse,
  startFlip,
  onKeyDown,
}: FlashcardCompProps) {
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className={cn("select-none", className)}>
      <div
        className={cn(
          `relative rounded-xl h-60 cursor-pointer transition-all duration-1000 [transform-style:preserve-3d]`,
          flipped && "[transform:rotateY(180deg)]",
          isSubmittingResponse && "duration-0",
        )}
        onClick={() => startFlip()}
      >
        <div className="absolute inset-0 bg-muted-foreground rounded-xl border border-black [backface-visibility:hidden]">
          <div className="flex h-full">
            <div className="m-auto text-center">
              <div className="flex w-fit mx-auto">
                <IconLanguage className="my-auto mr-1" />

                <p className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.sourceLanguageCode]}
                </p>

                <IconArrowRight className="mx-2 mt-1.5" size={16} />

                <p className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.translationLanguageCode]}
                </p>
              </div>

              <p className="text-xl">{flashcard.translation.word.word}</p>

              <p className="absolute left-0 bottom-5 w-full text-muted/40">
                Click on the card or press{" "}
                <Kbd className="bg-muted/40">Space</Kbd> to flip it
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-muted-foreground rounded-xl border border-black [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex flex-col h-full">
            <div className="m-auto text-center">
              <div className="flex w-fit mx-auto">
                <IconLanguage className="my-auto mr-1" />

                <p className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.translationLanguageCode]}
                </p>

                <IconArrowRight className="mx-2 mt-1.5" size={16} />

                <p className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.sourceLanguageCode]}
                </p>
              </div>

              <p className="text-xl">
                {flashcard.translation.translations[0].word}
              </p>

              <p className="absolute left-0 bottom-5 w-full text-muted/40">
                Click on the card or press{" "}
                <Kbd className="bg-muted/40">Space</Kbd> to flip it
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="-mt-57 h-60 w-full rounded-xl bg-muted-foreground h-6 border border-black"></div>
      <div className="-mt-61.5 h-60 w-full rounded-xl bg-muted-foreground h-6 border border-black"></div>
    </div>
  );
}
