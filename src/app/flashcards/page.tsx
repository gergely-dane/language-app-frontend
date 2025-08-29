"use client";
import { useFlashcard } from "@/hooks/use-flashcards";
import {
  IconArrowRight,
  IconCheck,
  IconLanguage,
  IconX,
} from "@tabler/icons-react";
import { LANGUAGES } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Flashcards() {
  const { data: flashcard, isLoading, error } = useFlashcard();
  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  if (isLoading) return <div>Loading flashcard...</div>;
  if (error) return <div>Error loading flashcard</div>;
  if (!flashcard) return <div>No flashcards found</div>;

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
    <div>
      <div className="select-none mx-2 lg:w-120 lg:mx-auto">
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
                  <IconArrowRight size={16} className="mx-2 mt-1.5" />
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
                  <IconArrowRight size={16} className="mx-2 mt-1.5" />
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
          <Button variant="outline" className="flex">
            <IconCheck className="text-green-500" />
            <div>{!wasFlipped ? "Know it" : "Knew it"}</div>
          </Button>
          <Button variant="outline" className="flex">
            <IconX className="text-red-500" />
            <div>{!wasFlipped ? "Don't know" : "Didn't know"}</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
