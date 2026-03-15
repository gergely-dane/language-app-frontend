"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { useTranslations } from "@/features/vocabulary/api/get-translations";
import { PaginationNavigator } from "@/features/vocabulary/components/pagination-navigator";
import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

type VocabularyTableFilters = {
  search: string;
  languageFilter: LanguagePair | null;
  pageNumber: number;
};

type VocabularyTableProps<TValue> = {
  columns: ColumnDef<Translation, TValue>[];
  filters: VocabularyTableFilters;
  onPageChange?: (page: number) => void;
};

export const VocabularyTable = <TValue,>({
  columns,
  filters,
  onPageChange,
}: VocabularyTableProps<TValue>) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data: words } = useTranslations({
    pageNumber: filters.pageNumber,
    search: filters.search,
    sourceLanguageId: filters.languageFilter?.sourceLanguageId,
    translationLanguageId: filters.languageFilter?.translationLanguageId,
    sortBy: sorting[0].id,
    sortAscending: !sorting[0].desc,
  });

  const table = useReactTable({
    data: words?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      columnVisibility: { createdAt: !isMobile, select: false },
    },
    getRowId: (row: Translation) => row.id.toString(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                {t("vocabulary.noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {onPageChange && words && (
        <PaginationNavigator
          className="mt-2"
          currentPage={words.currentPage}
          totalPages={words.totalPages}
          onChange={onPageChange}
        />
      )}
    </>
  );
};
