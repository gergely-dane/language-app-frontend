"use client";

import type { HeaderContext } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import type { TranslationListItem } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";

import { SortableTableHeaderText } from "./sortable-table-header-text";

export const WordHeader = ({
  column,
}: HeaderContext<TranslationListItem, unknown>) => {
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

export const NextReviewHeader = ({
  column,
}: HeaderContext<TranslationListItem, unknown>) => {
  const t = useI18n();
  return (
    <SortableTableHeaderText
      headerName={t("vocabulary.nextReview.title")}
      column={column}
    />
  );
};

export const AddedOnHeader = ({
  column,
}: HeaderContext<TranslationListItem, unknown>) => {
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
}: HeaderContext<TranslationListItem, unknown>) => {
  const t = useI18n();

  return (
    <Checkbox
      className="data-[state=checked]:border-primary-foreground"
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      aria-label={t("vocabulary.selection.selectAll")}
    />
  );
};
