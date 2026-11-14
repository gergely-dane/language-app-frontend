"use client";

import { IconArrowBackUp, IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

type FlashcardToolbarProps = {
  canUndo: boolean;
  canEdit: boolean;
  onUndo: () => void;
  onEdit: () => void;
};

export const FlashcardToolbar = ({
  canUndo,
  canEdit,
  onUndo,
  onEdit,
}: FlashcardToolbarProps) => {
  const t = useI18n();

  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={onUndo} disabled={!canUndo}>
        <IconArrowBackUp />
        {t("flashcards.undoReview")}
      </Button>

      <Button variant="outline" onClick={onEdit} disabled={!canEdit}>
        <IconPencil />
        {t("flashcards.editTranslation")}
      </Button>
    </div>
  );
};
