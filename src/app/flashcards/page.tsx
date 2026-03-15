"use client";

import {
  IconCheck,
  IconHandMove,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import {
  prefetchFlashcard,
  useFlashcard,
} from "@/features/flashcards/api/get-flashcard";
import { useRespondToFlashcard } from "@/features/flashcards/api/respond-to-flashcard";
import {
  FlashcardComp,
  type FlashcardCompHandle,
} from "@/features/flashcards/components/flashcard";
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

const Flashcards = () => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const flashcardRef = useRef<FlashcardCompHandle | null>(null);

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: flashcard,
    isLoading,
    error,
  } = useFlashcard(languagePair, flashcardIndex);
  const respondToFlashcard = useRespondToFlashcard();

  const areButtonsDisabled =
    isCardAnimating || respondToFlashcard.isPending || editDialogOpen;

  const handleRespond = useCallback(
    (knewIt: boolean) => {
      if (isCardAnimating || respondToFlashcard.isPending || !flashcard) {
        return;
      }

      void respondToFlashcard.mutateAsync({
        flashcardId: flashcard.id,
        response: { knewIt },
      });

      void prefetchFlashcard(languagePair, flashcardIndex);
    },
    [
      isCardAnimating,
      respondToFlashcard,
      flashcard,
      languagePair,
      flashcardIndex,
    ],
  );

  const onSwipeAnimationComplete = () => {
    setFlashcardIndex((prev) => prev + 1);
    setWasFlipped(false);
  };

  const onLanguagePairChange = (newPair: LanguagePair | null) => {
    setLanguagePair(newPair);
    setFlashcardIndex(0);
    flashcardRef.current?.reset();
  };

  if (isLoading) return <p>{t("flashcards.loadingFlashcard")}</p>;
  if (error) return <p>{t("flashcards.errorLoadingFlashcard")}</p>;
  if (!flashcard) return <p>{t("flashcards.noFlashcardsFound")}</p>;

  return (
    <div className="mx-auto flex w-full flex-col gap-4 lg:w-120">
      <div className="flex">
        <LanguagePairSelector
          className="w-fit"
          value={languagePair}
          onChange={(newPair) => onLanguagePairChange(newPair)}
          disabled={areButtonsDisabled}
        />

        <Button
          className="ml-auto"
          variant="outline"
          onClick={() => setEditDialogOpen(true)}
          disabled={areButtonsDisabled}
        >
          <IconPencil />
          {t("general.edit")}
        </Button>
      </div>

      <FlashcardComp
        key={flashcard.id}
        ref={flashcardRef}
        flashcard={flashcard}
        disabled={areButtonsDisabled}
        onAnimationStateChange={setIsCardAnimating}
        onRespond={handleRespond}
        onSwipeAnimationComplete={onSwipeAnimationComplete}
        setEditDialogOpen={setEditDialogOpen}
      />

      <div className="mx-auto mt-4 grid grid-cols-2 gap-10 px-10">
        <Button
          className="flex"
          variant="outline"
          onClick={() => flashcardRef.current?.respond(false)}
          disabled={areButtonsDisabled}
        >
          <IconX className="text-destructive mt-0.5" />

          <p>
            {!wasFlipped ? t("flashcards.dontKnow") : t("flashcards.didntKnow")}
          </p>
        </Button>

        <Button
          className="flex"
          variant="outline"
          onClick={() => flashcardRef.current?.respond(true)}
          disabled={areButtonsDisabled}
        >
          <IconCheck className="text-success mt-0.5" />

          <p>{!wasFlipped ? t("flashcards.knowIt") : t("flashcards.knewIt")}</p>
        </Button>
      </div>

      {!isMobile ? (
        <p className="text-muted-foreground/70 mx-auto text-center text-sm">
          {t.rich("flashcards.hintUseArrowKeysOrSwipe", {
            left: (chunks) => <Kbd>{chunks}</Kbd>,
            right: (chunks) => <Kbd>{chunks}</Kbd>,
          })}
        </p>
      ) : (
        <p className="text-muted-foreground/70 mx-auto flex gap-1.5 text-center text-sm">
          {t.rich("flashcards.hintTrySwiping", {
            hand: () => <IconHandMove />,
          })}
        </p>
      )}

      <AddEditWordDialog
        open={editDialogOpen}
        onOpenChange={(open) => setEditDialogOpen(open)}
        editMode={true}
        currentTranslation={flashcard.translation}
        onSave={() => flashcardRef.current?.reset()}
      />
    </div>
  );
};

export default Flashcards;
