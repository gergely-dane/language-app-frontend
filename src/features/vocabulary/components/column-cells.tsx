"use client";

import { IconArrowNarrowRight, IconPencil } from "@tabler/icons-react";
import type { CellContext } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import type { Translation, Word } from "@/interfaces/translation.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";

export const TranslationsCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  return (getValue() as Word[])?.map((w: Word) => w.word)?.join(", ");
};

export const LanguageCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const isMobile = useIsMobileScreen();
  const { getLanguage } = useLanguages();

  const [sourceLanguageId, translationLanguageId] = (
    getValue() as string
  ).split("-");

  return (
    <div className="flex gap-0.5">
      <p className={isMobile ? "uppercase" : ""}>
        {!isMobile
          ? LANGUAGES[getLanguage(Number(sourceLanguageId))?.code || ""]
          : getLanguage(Number(sourceLanguageId))?.code}
      </p>

      <IconArrowNarrowRight className="mt-0.5 shrink-0" size={16} />

      <p className={isMobile ? "uppercase" : ""}>
        {!isMobile
          ? LANGUAGES[getLanguage(Number(translationLanguageId))?.code || ""]
          : getLanguage(Number(translationLanguageId))?.code}
      </p>
    </div>
  );
};

export const AddedOnCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const date = new Date(getValue() as string);
  return date.toLocaleDateString();
};

export const KnowledgeLevelCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const level = Math.ceil((getValue() as number) / 25);
  const colors = [
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-green-500",
  ] as const;

  return <div className={cn("h-4 w-4 rounded-full", colors[level])} />;
};

export type EditCellProps = CellContext<Translation, unknown> & {
  onEdit: (translation: Translation) => void;
};

export const EditCell = ({ row, onEdit }: EditCellProps) => {
  const rowData = row.original;

  return (
    <Button variant="outline" size="icon" onClick={() => onEdit(rowData)}>
      <IconPencil />
    </Button>
  );
};

export const SelectCell = ({ row }: CellContext<Translation, unknown>) => (
  <Checkbox
    className="mr-4 pt-4"
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    checked={row.getIsSelected()}
    aria-label="Select row"
  />
);
