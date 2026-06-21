"use client";

import {
  IconCheck,
  IconHandMove,
  IconHelp,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { useFlashcard } from "@/features/flashcards/api/get-flashcard";
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
  const translationRef = useRef<FlashcardCompHandle | null>(null);

  const [languagePair, setLanguagePair] = useState<LanguagePair | null>(null);
  const [translationIndex, setTranslationIndex] = useState(0);
  const [wasFlipped, setWasFlipped] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    data: translation,
    isLoading,
    error,
  } = useFlashcard(languagePair, translationIndex);
  const respondToFlashcard = useRespondToFlashcard(translationIndex);

  const areButtonsDisabled =
    isCardAnimating || respondToFlashcard.isPending || editDialogOpen;

  const handleRespond = useCallback(
    async (response: 1 | 2 | 3) => {
      if (isCardAnimating || respondToFlashcard.isPending || !translation) {
        return;
      }

      await respondToFlashcard.mutateAsync({
        translationId: translation.id,
        response: {
          response,
          nextCardQuery: languagePair,
        },
      });

      if (response === 2) {
        setTranslationIndex((prev) => prev + 1);
        translationRef.current?.reset();
      }
    },
    [isCardAnimating, respondToFlashcard, translation, languagePair],
  );

  const onSwipeAnimationComplete = () => {
    setTranslationIndex((prev) => prev + 1);
    setWasFlipped(false);
  };

  const onLanguagePairChange = (newPair: LanguagePair | null) => {
    setLanguagePair(newPair);
    setTranslationIndex(0);
    translationRef.current?.reset();
  };

  if (isLoading) return <p>{t("flashcards.loadingFlashcard")}</p>;
  if (error) return <p>{t("flashcards.errorLoadingFlashcard")}</p>;
  if (!translation) return <p>{t("flashcards.noFlashcardsFound")}</p>;

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
        key={translationIndex}
        ref={translationRef}
        translation={translation}
        disabled={areButtonsDisabled}
        onAnimationStateChange={setIsCardAnimating}
        onFlipStateChange={setWasFlipped}
        onRespond={(knewIt) => {
          void handleRespond(knewIt ? 3 : 1);
        }}
        onSwipeAnimationComplete={onSwipeAnimationComplete}
        setEditDialogOpen={setEditDialogOpen}
      />

      <div className="mx-auto mt-4 grid grid-cols-3 gap-3 md:gap-6 md:px-8">
        <Button
          className="flex"
          variant="outline"
          onClick={() => translationRef.current?.respond(false)}
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
          onClick={() => void handleRespond(2)}
          disabled={areButtonsDisabled}
        >
          <IconHelp className="text-muted-foreground mt-0.5" />

          <p>
            {!wasFlipped ? t("flashcards.notSure") : t("flashcards.wasntSure")}
          </p>
        </Button>

        <Button
          className="flex"
          variant="outline"
          onClick={() => translationRef.current?.respond(true)}
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
        currentTranslation={translation}
        flashcardQueryKey={["flashcards", languagePair, translationIndex]}
      />
    </div>
  );
};

export default Flashcards;
