import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/hooks/use-i18n";

type ResetProgressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export const ResetProgressDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ResetProgressDialogProps) => {
  const t = useI18n();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isLoading) onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("vocabulary.resetProgress.title")}</DialogTitle>

          <DialogDescription>
            {t("vocabulary.resetProgress.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("general.cancel")}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {t("vocabulary.resetProgress.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
