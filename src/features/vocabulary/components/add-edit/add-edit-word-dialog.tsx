import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AddEditFormContent } from "@/features/vocabulary/components/add-edit/add-edit-form-content";
import { type Translation } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";

type AddEditWordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode?: boolean;
  currentTranslation?: Translation;
  flashcardQueryKey?: readonly unknown[];
  onDeleted?: () => void;
  onProgressReset?: () => void;
};

export const AddEditWordDialog = ({
  open,
  onOpenChange,
  editMode = false,
  currentTranslation,
  flashcardQueryKey,
  onDeleted,
  onProgressReset,
}: AddEditWordDialogProps) => {
  const t = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">{t("vocabulary.addWord")}</DialogTitle>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto px-4 lg:px-8">
        <AddEditFormContent
          editMode={editMode}
          onClose={() => onOpenChange(false)}
          currentTranslation={currentTranslation}
          flashcardQueryKey={flashcardQueryKey}
          onDeleted={onDeleted}
          onProgressReset={onProgressReset}
        />
      </DialogContent>
    </Dialog>
  );
};
