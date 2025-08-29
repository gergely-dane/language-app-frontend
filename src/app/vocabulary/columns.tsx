"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Translation, Word } from "@/hooks/use-translations";
import { SortableTableHeaderText } from "@/components/sortable-table-header-text";
import LanguagePairFlags from "@/components/language-pair-flags";
import { Checkbox } from "@/components/ui/checkbox";

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
      const [sourceLanguage, translationLanguage] = (getValue() as string).split(
        "-",
      );
      return (
        <LanguagePairFlags
          sourceLanguage={sourceLanguage}
          translationLanguage={translationLanguage}
        />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <SortableTableHeaderText headerName="Added on" column={column} />;
    },
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="pt-4"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="pt-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
];
