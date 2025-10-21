"use client";

import { FlashcardComp } from "@/app/flashcards/components/flashcard";
import { useFlashcard, useRespondToFlashcard } from "@/app/flashcards/hooks";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function Flashcards() {
  const [wasFlipped, setWasFlipped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const t = useI18n();
  const respondToFlashcard = useRespondToFlashcard();
  const { data: flashcard, isLoading, error, refetch } = useFlashcard();

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

  const sendResponse = async (knewIt: boolean) => {
    if (isSubmittingResponse) return;
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
    <div className="lg:w-120 lg:mx-auto">
      <FlashcardComp
        flashcard={flashcard}
        flipped={flipped}
        startFlip={startFlip}
      />

      <div className="grid grid-cols-2 gap-10 px-10 mx-auto mt-6">
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
    </div>
  );
}
