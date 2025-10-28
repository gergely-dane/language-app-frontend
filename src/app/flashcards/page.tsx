"use client";

import { FlashcardComp } from "@/app/flashcards/components/flashcard";
import { useFlashcard, useRespondToFlashcard } from "@/app/flashcards/hooks";
import { LanguagePairSelector } from "@/app/vocabulary/components/language-pair-selector";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePair } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { IconCheck, IconX } from "@tabler/icons-react";
import { KeyboardEvent, useState } from "react";

export default function Flashcards() {
  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);

  const t = useI18n();
  const respondToFlashcard = useRespondToFlashcard();
  const {
    data: flashcard,
    isLoading,
    error,
    refetch,
  } = useFlashcard(languagePair);

  if (isLoading) return <div>Loading flashcard...</div>;
  if (error) return <div>Error loading flashcard</div>;
  if (!flashcard) return <div>No flashcards found</div>;

  const startFlip = (e?: KeyboardEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    setFlipped(!flipped);
    setWasFlipped(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    switch (e.key) {
      case " ":
        startFlip();
        break;
      case "ArrowLeft":
        sendResponse(true);
        break;
      case "ArrowRight":
        sendResponse(false);
        break;
    }
  };

  const sendResponse = async (knewIt: boolean) => {
    if (isSubmittingResponse || isAnimating) return;
    setIsSubmittingResponse(true);

    await respondToFlashcard.mutateAsync({
      flashcardId: flashcard.id,
      response: { knewIt },
    });

    setFlipped(false);
    setWasFlipped(false);
    await refetch();

    setIsSubmittingResponse(false);
  };

  return (
    <div className="flex flex-col mt-6 mx-auto gap-4 lg:w-120">
      <LanguagePairSelector
        className="mx-2 w-fit lg:mx-0"
        value={languagePair}
        onChange={setLanguagePair}
      />

      <FlashcardComp
        className="mx-2 lg:mx-0"
        flashcard={flashcard}
        flipped={flipped}
        startFlip={startFlip}
        isSubmittingResponse={isSubmittingResponse}
        onKeyDown={onKeyDown}
      />

      <div className="grid grid-cols-2 gap-10 px-10 mx-auto mt-4">
        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(true)}
          disabled={isSubmittingResponse}
        >
          <IconCheck className="text-green-500" />

          <div>
            {!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}
          </div>
        </Button>

        <Button
          className="flex"
          variant="outline"
          onClick={() => sendResponse(false)}
          disabled={isSubmittingResponse}
        >
          <IconX className="text-red-500" />

          <div>
            {!wasFlipped ? t("flashcards.dontKnow") : t("flashcards.didntKnow")}
          </div>
        </Button>
      </div>

      <p className="text-muted-foreground/40 mx-auto">
        Hint: you can use the arrow keys (<Kbd>◀</Kbd> and <Kbd>▶</Kbd>) to
        respond.
      </p>
    </div>
  );
}
