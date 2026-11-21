import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExportFormContent } from "@/features/vocabulary/components/export/export-form-content";
import type { ExportFilter } from "@/features/vocabulary/types";

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: number[];
  filter: ExportFilter;
  isFiltered: boolean;
  filteredCount: number;
};

export const ExportDialog = ({
  open,
  onOpenChange,
  selectedIds,
  filter,
  isFiltered,
  filteredCount,
}: ExportDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <ExportFormContent
        selectedIds={selectedIds}
        filter={filter}
        isFiltered={isFiltered}
        filteredCount={filteredCount}
        onClose={() => onOpenChange(false)}
      />
    </DialogContent>
  </Dialog>
);
