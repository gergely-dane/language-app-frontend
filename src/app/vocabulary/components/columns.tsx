"use client";

import { Translation, Word } from "@/app/vocabulary/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconArrowNarrowRight, IconStar } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableTableHeaderText } from "./sortable-table-header-text";

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
      const [sourceLanguage, translationLanguage] = (
        getValue() as string
      ).split("-");
      const isMobileScreen = useIsMobileScreen();

      return (
        <div className="flex">
          <div className={isMobileScreen ? "uppercase" : ""}>
            {!isMobileScreen ? LANGUAGES[sourceLanguage] : sourceLanguage}
          </div>
          <IconArrowNarrowRight className="mx-0.5 mt-0.5" size={16} />
          <div className={isMobileScreen ? "uppercase" : ""}>
            {!isMobileScreen
              ? LANGUAGES[translationLanguage]
              : translationLanguage}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableTableHeaderText headerName="Added on" column={column} />
    ),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      const isMobileScreen = useIsMobileScreen();

      return (
        <SortableTableHeaderText
          headerName={!isMobileScreen ? "Knowledge level" : ""}
          icon={
            isMobileScreen ? <IconStar className="my-auto" size={16} /> : null
          }
          column={column}
        />
      );
    },
    cell: ({ getValue }) => {
      const level = Math.round((getValue() as number) / 20);
      const colors = [
        "bg-orange-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-green-500",
      ];

      return <div className={cn("h-4 w-4 rounded-full", colors[level])} />;
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-4 pt-4"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4 pt-4"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        aria-label="Select row"
      />
    ),
  },
];
