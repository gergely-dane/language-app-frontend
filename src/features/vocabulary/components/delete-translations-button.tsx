import { Button } from "@/components/ui/button";
import { DeleteWordDialog } from "@/features/vocabulary/components/delete-word-dialog";
import { useI18n } from "@/hooks/use-i18n";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

interface DeleteTranslationsButtonProps {
  selectedRowCount: number;
  onDelete: () => void;
}

export const DeleteTranslationsButton = ({
  selectedRowCount,
  onDelete,
}: DeleteTranslationsButtonProps) => {
  const t = useI18n();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = () => {
    if (selectedRowCount > 1) {
      setDialogOpen(true);
    } else {
      onDelete();
    }
  };

  return (
    <>
      <Button
        className="ml-auto"
        variant="outline"
        onClick={handleClick}
        disabled={selectedRowCount === 0}
      >
        <IconTrash className="text-destructive" />
      </Button>

      <DeleteWordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        wordCount={selectedRowCount}
        onDelete={onDelete}
      />
    </>
  );
};
