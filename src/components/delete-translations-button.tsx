import { Button } from "@/components/ui/button";
import React from "react";
import { useDeleteTranslationsBulk } from "@/hooks/use-translations";
import { IconTrash } from "@tabler/icons-react";
import { useAlert } from "@/lib/alert-context";

type DeleteTranslationsButtonProps = {
  rowSelection: Record<string, boolean>;
  className?: string;
};

export function DeleteTranslationsButton({
  rowSelection,
  className,
}: DeleteTranslationsButtonProps) {
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
        title: "Translations deleted successfully",
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
