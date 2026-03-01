import { AddEditFormContent } from "@/components/ui/add-edit-form-content";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { type Translation } from "@/interfaces/translation.interface";

type AddEditWordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode?: boolean;
  currentTranslation?: Translation;
  onSave?: () => void;
};

export const AddEditWordDialog = ({
  open,
  onOpenChange,
  editMode = false,
  currentTranslation,
  onSave,
}: AddEditWordDialogProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const form = (
    <AddEditFormContent
      editMode={editMode}
      onClose={() => onOpenChange(false)}
      currentTranslation={currentTranslation}
      onSave={onSave}
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTitle className="sr-only">{t("vocabulary.addWord")}</DrawerTitle>
      <DrawerContent className="px-4 pb-4">{form}</DrawerContent>
    </Drawer>
  );
};
