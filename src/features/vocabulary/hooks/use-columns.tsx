"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import {
  AddedOnCell,
  EditCell,
  SelectCell,
  TranslationsCell,
  WordCell,
} from "@/features/vocabulary/components/table/column-cells";
import {
  AddedOnHeader,
  SelectHeader,
  TranslationsHeader,
  WordHeader,
} from "@/features/vocabulary/components/table/column-headers";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";

export const useColumns = (
  onEdit: (translation: Translation) => void,
): ColumnDef<Translation>[] => {
  return useMemo(
    () => [
      {
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
        meta: {
          className: "w-10",
        },
      },
      {
        id: "word",
        accessorFn: (tr) => tr.words?.[0]?.word,
        header: WordHeader,
        filterFn: "includesString",
        cell: WordCell,
        meta: {
          className: "w-1/2 md:w-1/3",
        },
      },
      {
        accessorKey: "translations",
        header: TranslationsHeader,
        cell: TranslationsCell,
        meta: {
          className: "w-1/2 md:w-1/3",
        },
      },
      {
        accessorKey: "createdAt",
        header: AddedOnHeader,
        cell: AddedOnCell,
        meta: {
          className: "w-1/3",
        },
      },
      {
        id: "edit",
        cell: (context) => <EditCell {...context} onEdit={onEdit} />,
        meta: {
          className: "w-14",
        },
      },
    ],
    [onEdit],
  );
};
