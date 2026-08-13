"use client";

import type { HeaderContext } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useI18n } from "@/hooks/use-i18n";

import { SortableTableHeaderText } from "./sortable-table-header-text";

export const WordHeader = ({ column }: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  return (
    <SortableTableHeaderText headerName={t("general.word")} column={column} />
  );
};

export const TranslationsHeader = () => {
  const t = useI18n();
  return (
    <p className="text-xs font-medium tracking-wide uppercase">
      {t("general.translations")}
    </p>
  );
};

export const AddedOnHeader = ({
  column,
}: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  return (
    <SortableTableHeaderText
      headerName={t("general.addedOn")}
      column={column}
    />
  );
};

export const SelectHeader = ({
  table,
}: HeaderContext<Translation, unknown>) => (
  <Checkbox
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    checked={
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    aria-label="Select all"
  />
);
