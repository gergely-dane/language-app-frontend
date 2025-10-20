"use client";
import { Flashcard } from "@/app/flashcards/hooks";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconCheck,
  IconLanguage,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";

interface FlashcardCompProps {
  className?: string;
  flashcard: Flashcard;
}

export function FlashcardComp({ className, flashcard }: FlashcardCompProps) {
  const t = useI18n();

  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startFlip = () => {
    if (isAnimating) return;
    setFlipped(!flipped);
    setWasFlipped(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className={cn("select-none mx-2 lg:w-120", className)}>
      <div
        className={cn(
          `relative rounded-xl h-60 mx-auto mt-18 cursor-pointer transition-all duration-1000 [transform-style:preserve-3d]`,
          flipped && "[transform:rotateY(180deg)]",
        )}
        onClick={() => startFlip()}
      >
        <div className="absolute inset-0 bg-muted-foreground rounded-xl [backface-visibility:hidden]">
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

        <div className="absolute inset-0 bg-muted-foreground rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
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

      <div className="grid grid-cols-2 gap-10 px-10 mx-auto mt-6">
        <Button className="flex" variant="outline">
          <IconCheck className="text-green-500" />
          <div>
            {!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}
          </div>
        </Button>
        <Button className="flex" variant="outline">
          <IconX className="text-red-500" />
          <div>
            {!wasFlipped ? t("flashcards.dontKnow") : t("flashcards.didntKnow")}
          </div>
        </Button>
      </div>
    </div>
  );
}
