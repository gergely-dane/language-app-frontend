"use client";

import { FlashcardComp } from "@/app/flashcards/components/flashcard";
import { useFlashcard } from "@/app/flashcards/hooks";

export default function Flashcards() {
  const { data: flashcard, isLoading, error } = useFlashcard();

  if (isLoading) return <div>Loading flashcard...</div>;
  if (error) return <div>Error loading flashcard</div>;
  if (!flashcard) return <div>No flashcards found</div>;

  return (
    <div>
      <FlashcardComp className="lg:mx-auto" flashcard={flashcard} />
    </div>
  );
}
