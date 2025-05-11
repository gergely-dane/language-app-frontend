"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Translation, Word } from "@/hooks/use-translations";
import { SortableTableHeaderText } from "@/components/sortable-table-header-text";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import Flag from "react-flagpack";

export interface LanguagePair {
  sourceLanguage: string;
  translationLanguage: string;
}

export const columns: ColumnDef<Translation>[] = [
  {
    id: "word",
    accessorFn: (tr) => tr.word?.word,
    header: ({ column }) => (
      <SortableTableHeaderText headerName="Word" column={column} />
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "translations",
    header: "Translation(s)",
    cell: ({ getValue }) => {
      return (getValue() as Word[])?.map((w: Word) => w.word)?.join(", ");
    },
  },
  {
    id: "language",
    header: "Language",
    accessorFn: (tr) => {
      return `${tr.sourceLanguageCode}-${tr.translationLanguageCode}`;
    },
    cell: ({ getValue }) => {
      let [sourceLanguage, translationLanguage] = (getValue() as string).split(
        "-",
      );
      sourceLanguage = sourceLanguage == "en" ? "gb-ukm" : sourceLanguage;
      translationLanguage =
        translationLanguage == "en" ? "gb-ukm" : translationLanguage;
      return (
        <div className="flex gap-1">
          <Flag code={sourceLanguage} size="m" hasDropShadow className="mt-1" />
          <IconArrowNarrowRight />
          <Flag
            code={translationLanguage}
            size="m"
            hasDropShadow
            className="mt-1"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return <SortableTableHeaderText headerName="Added on" column={column} />;
    },
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
];
