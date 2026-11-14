import { IconRestore } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useAlert } from "@/context/alert-context";
import { useResetTranslationProgress } from "@/features/vocabulary/api/reset-translation-progress";
import { ResetProgressDialog } from "@/features/vocabulary/components/add-edit/reset-progress-dialog";
import { useI18n } from "@/hooks/use-i18n";

type ResetProgressButtonProps = {
  translationId?: number;
  onReset: () => void;
};

export const ResetProgressButton = ({
  translationId,
  onReset,
}: ResetProgressButtonProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const resetProgress = useResetTranslationProgress(translationId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReset = async () => {
    try {
      await resetProgress.mutateAsync();
      setIsDialogOpen(false);
      onReset();
      showAlert({
        title: t("vocabulary.resetProgress.success"),
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title:
          (error.response?.data?.message as string) ||
          t("vocabulary.resetProgress.error"),
        variant: "destructive",
      });
    }
  };

  return (
    // Enter from here, portaled dialog included, must not reach the edit form's save shortcut
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") e.stopPropagation();
      }}
    >
      <Tooltip content={t("vocabulary.resetProgress.tooltip")}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
        >
          <IconRestore />
        </Button>
      </Tooltip>

      <ResetProgressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={() => void handleReset()}
        isLoading={resetProgress.isPending}
      />
    </div>
  );
};
