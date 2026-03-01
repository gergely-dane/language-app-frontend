"use client";

import { IconStar } from "@tabler/icons-react";
import type { HeaderContext } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import type { Translation } from "@/interfaces/translation.interface";

import { SortableTableHeaderText } from "./sortable-table-header-text";

export const WordHeader = ({ column }: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  return (
    <SortableTableHeaderText headerName={t("general.word")} column={column} />
  );
};

export const TranslationsHeader = () => {
  const t = useI18n();
  return <p>{t("general.translations")}</p>;
};

export const LanguageHeader = () => {
  const t = useI18n();
  return <p>{t("general.language")}</p>;
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

export const KnowledgeLevelHeader = ({
  column,
}: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  return (
    <SortableTableHeaderText
      headerName={!isMobile ? t("general.knowledgeLevel") : ""}
      icon={isMobile ? <IconStar className="my-auto" size={16} /> : null}
      column={column}
    />
  );
};

export const SelectHeader = ({
  table,
}: HeaderContext<Translation, unknown>) => (
  <Checkbox
    className="mr-4 pt-4"
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    checked={
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    aria-label="Select all"
  />
);
