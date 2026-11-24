import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImportFormContent } from "@/features/vocabulary/components/import/import-form-content";

type ImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ImportDialog = ({ open, onOpenChange }: ImportDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <ImportFormContent onClose={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
);
