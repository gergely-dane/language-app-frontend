"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import {
  AddedOnCell,
  EditCell,
  KnowledgeLevelCell,
  LanguageCell,
  SelectCell,
  TranslationsCell,
  WordCell,
} from "@/features/vocabulary/components/column-cells";
import {
  AddedOnHeader,
  KnowledgeLevelHeader,
  LanguageHeader,
  SelectHeader,
  TranslationsHeader,
  WordHeader,
} from "@/features/vocabulary/components/column-headers";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";

export const useColumns = (
  onEdit: (translation: Translation) => void,
): ColumnDef<Translation>[] => {
  return useMemo(
    () => [
      {
        id: "word",
        accessorFn: (tr) => tr.words?.[0]?.word,
        header: WordHeader,
        filterFn: "includesString",
        cell: WordCell,
      },
      {
        accessorKey: "translations",
        header: TranslationsHeader,
        cell: TranslationsCell,
      },
      {
        id: "language",
        header: LanguageHeader,
        accessorFn: (tr) => {
          return `${tr.sourceLanguageId}-${tr.targetLanguageId}`;
        },
        cell: LanguageCell,
      },
      {
        accessorKey: "createdAt",
        header: AddedOnHeader,
        cell: AddedOnCell,
      },
      {
        accessorKey: "score",
        header: KnowledgeLevelHeader,
        cell: KnowledgeLevelCell,
      },
      {
        id: "edit",
        cell: (context) => <EditCell {...context} onEdit={onEdit} />,
      },
      {
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
      },
    ],
    [onEdit],
  );
};
