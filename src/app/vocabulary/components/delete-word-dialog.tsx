import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/hooks/use-i18n";

interface DeleteWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wordCount: number;
  onDelete: () => void;
}

export function DeleteWordDialog({
  open,
  onOpenChange,
  wordCount,
  onDelete,
}: DeleteWordDialogProps) {
  const t = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("vocabulary.deleteWords.areYouSure")}</DialogTitle>
          <DialogDescription>
            {t("vocabulary.deleteWords.description", { count: wordCount })}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("general.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete();
              onOpenChange(false);
            }}
          >
            {t("vocabulary.deleteWords.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
