"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Translation, Word } from "@/hooks/use-translations";
import { SortableTableHeaderText } from "@/components/sortable-table-header-text";
import { LANGUAGES } from "@/lib/constants";
import { IconArrowNarrowRight } from "@tabler/icons-react";

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
    accessorFn: (tr) =>
      `${LANGUAGES[tr.sourceLanguageCode]} → ${LANGUAGES[tr.translationLanguageCode]}`,
    cell: ({ getValue }) => {
      const [sourceLang, targetLang] = (getValue() as string).split(" → ");
      return (
        <div className="flex gap-1">
          {sourceLang} <IconArrowNarrowRight /> {targetLang}
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
