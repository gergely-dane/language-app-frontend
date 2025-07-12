import { Button } from "@/components/ui/button";
import React from "react";
import { useDeleteTranslationsBulk } from "@/hooks/use-translations";
import { IconTrash } from "@tabler/icons-react";
import { useAlert } from "@/lib/alert-context";

export function DeleteTranslationsButton({
  rowSelection,
}: {
  rowSelection: Record<string, boolean>;
}) {
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
      await deleteTranslation.mutateAsync({ ids: Object.keys(rowSelection) });
      showAlert({
        title: "Translations deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete translations:", error);
    }
  };

  return (
    <Button variant="outline" className="ml-auto" onClick={handleDelete}>
      <IconTrash className="text-destructive" />
    </Button>
  );
}
