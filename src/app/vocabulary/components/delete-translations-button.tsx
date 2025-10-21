import { useDeleteTranslationsBulk } from "@/app/vocabulary/hooks";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { useAlert } from "@/lib/alert-context";
import { IconTrash } from "@tabler/icons-react";

type DeleteTranslationsButtonProps = {
  rowSelection: Record<string, boolean>;
  className?: string;
};

export function DeleteTranslationsButton({
  rowSelection,
  className,
}: DeleteTranslationsButtonProps) {
  const t = useI18n();

  const deleteTranslation = useDeleteTranslationsBulk();
  const { showAlert } = useAlert();

  const handleDelete = async () => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );

    if (selectedRows.length === 0) {
      return;
    }

    try {
      await deleteTranslation.mutateAsync({
        ids: Object.keys(rowSelection).map((key) => Number(key)),
      });
      showAlert({
        title: t("vocabulary.translationsDeletedSuccessfully"),
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete translations:", error);
    }
  };

  return (
    <Button
      className={className}
      variant="outline"
      onClick={handleDelete}
      disabled={!rowSelection || !Object.keys(rowSelection).length}
    >
      <IconTrash className="text-destructive" />
    </Button>
  );
}
