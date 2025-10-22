"use client";
import { Flashcard } from "@/app/flashcards/hooks";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconLanguage } from "@tabler/icons-react";

interface FlashcardCompProps {
  className?: string;
  flashcard: Flashcard;
  flipped: boolean;
  isSubmittingResponse: boolean;
  startFlip: () => void;
}

export function FlashcardComp({
  className,
  flashcard,
  flipped,
  isSubmittingResponse,
  startFlip,
}: FlashcardCompProps) {
  return (
    <div className={cn("select-none mx-2 lg:mx-0", className)}>
      <div
        className={cn(
          `relative rounded-xl h-60 mx-auto mt-18 cursor-pointer transition-all duration-1000 [transform-style:preserve-3d]`,
          flipped && "[transform:rotateY(180deg)]",
          isSubmittingResponse && "duration-0",
        )}
        onClick={() => startFlip()}
      >
        <div className="absolute inset-0 bg-muted-foreground rounded-xl border border-black [backface-visibility:hidden]">
          <div className="flex h-full">
            <div className="m-auto text-center">
              <div className="flex w-fit mx-auto">
                <IconLanguage className="mt-0.5 mr-1" />

                <div className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.sourceLanguageCode]}
                </div>

                <IconArrowRight className="mx-2 mt-1.5" size={16} />

                <div className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.translationLanguageCode]}
                </div>
              </div>

              <div className="text-xl">{flashcard.translation.word.word}</div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-muted-foreground rounded-xl border border-black [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-full">
            <div className="m-auto text-center">
              <div className="flex w-fit mx-auto">
                <IconLanguage className="mt-0.5 mr-1" />

                <div className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.translationLanguageCode]}
                </div>

                <IconArrowRight className="mx-2 mt-1.5" size={16} />

                <div className="text-sm my-auto">
                  {LANGUAGES[flashcard.translation.sourceLanguageCode]}
                </div>
              </div>
              <div className="text-xl">
                {flashcard.translation.translations[0].word}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="-mt-57 h-60 w-full rounded-xl bg-muted-foreground h-6 border border-black"></div>
      <div className="-mt-61.5 h-60 w-full rounded-xl bg-muted-foreground h-6 border border-black"></div>
    </div>
  );
}
