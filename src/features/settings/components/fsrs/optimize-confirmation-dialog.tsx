"use client";

import { IconCards, IconClock, IconInfoCircle } from "@tabler/icons-react";
import { useFormatter } from "next-intl";

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

type OptimizeConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  reviewCount: number;
};

export const OptimizeConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  reviewCount,
}: OptimizeConfirmationDialogProps) => {
  const t = useI18n();
  const format = useFormatter();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isLoading) onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings.optimizeConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.optimizeConfirmDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <IconCards className="text-primary size-4" />
                <p className="text-muted-foreground text-sm font-medium">
                  {t("settings.totalReviews")}
                </p>
              </div>
              <p className="text-xl font-bold">{format.number(reviewCount)}</p>
            </div>

            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <IconClock className="size-4 text-sky-500" />
                <p className="text-muted-foreground text-sm font-medium">
                  {t("settings.estimatedTime")}
                </p>
              </div>
              <p className="text-xl font-bold">
                {t("settings.estimatedTimeValue")}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <IconInfoCircle className="size-4 shrink-0" />
            {t("settings.optimizeConfirmNote")}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("settings.cancel")}
          </Button>

          <Button onClick={onConfirm} isLoading={isLoading}>
            {t("settings.optimizeConfirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
