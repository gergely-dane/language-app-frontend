"use client";

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

type ResetConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export const ResetConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ResetConfirmationDialogProps) => {
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
          <DialogTitle>{t("settings.resetConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.resetConfirmDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("settings.cancel")}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {t("settings.resetConfirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
