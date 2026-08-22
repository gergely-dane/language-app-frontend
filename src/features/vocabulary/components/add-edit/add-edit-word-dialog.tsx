import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { AddEditFormContent } from "@/features/vocabulary/components/add-edit/add-edit-form-content";
import { type Translation } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

type AddEditWordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode?: boolean;
  currentTranslation?: Translation;
  flashcardQueryKey?: readonly unknown[];
  onDeleted?: () => void;
};

export const AddEditWordDialog = ({
  open,
  onOpenChange,
  editMode = false,
  currentTranslation,
  flashcardQueryKey,
  onDeleted,
}: AddEditWordDialogProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const form = (
    <AddEditFormContent
      editMode={editMode}
      onClose={() => onOpenChange(false)}
      currentTranslation={currentTranslation}
      flashcardQueryKey={flashcardQueryKey}
      onDeleted={onDeleted}
    />
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle className="sr-only">{t("vocabulary.addWord")}</DialogTitle>
        <DialogContent className="px-4 lg:px-8">{form}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerTitle className="sr-only">{t("vocabulary.addWord")}</DrawerTitle>
      <DrawerContent>
        <div className="overflow-y-auto px-4 pb-4">{form}</div>
      </DrawerContent>
    </Drawer>
  );
};
