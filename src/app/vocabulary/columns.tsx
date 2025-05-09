"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Translation } from "@/hooks/use-translations";
import { SortableTableHeaderText } from "@/components/sortable-table-header-text";

export const columns: ColumnDef<Translation>[] = [
  {
    accessorKey: "word",
    header: ({ column }) => {
      return <SortableTableHeaderText headerName="Word" column={column} />;
    },
  },
  {
    accessorKey: "translations",
    header: "Translation(s)",
    cell: ({ getValue }) => {
      return (getValue() as string[])?.join(", ");
    },
  },
  {
    accessorFn: (tr) =>
      `${tr.sourceLanguageCode} → ${tr.translationLanguageCode}`,
    header: "Language",
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
