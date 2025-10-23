"use client";

import { Translation } from "@/app/vocabulary/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LanguagePair } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { IconX } from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { AddWordDialog } from "./add-word-dialog";
import { DeleteTranslationsButton } from "./delete-translations-button";
import { LanguagePairSelector } from "./language-pair-selector";

interface VocabularyTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function VocabularyTable<TData, TValue>({
  columns,
  data,
}: VocabularyTableProps<TData, TValue>) {
  const t = useI18n();

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility: { createdAt: !useIsMobileScreen() },
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: Translation) => row.id,
  });

  const getFilterValue: LanguagePair | null = () => {
    const filterValue = table.getColumn("language")?.getFilterValue() as string;
    if (!filterValue) {
      return null;
    }

    const [sourceLanguageCode, translationLanguageCode] =
      filterValue.split("-");
    return {
      sourceLanguageCode,
      translationLanguageCode,
    };
  };

  const setLanguageFilter = (languagePair: LanguagePair | null) => {
    table
      .getColumn("language")
      ?.setFilterValue(
        languagePair
          ? `${languagePair.sourceLanguageCode}-${languagePair.translationLanguageCode}`
          : null,
      );
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex">
          <Input
            className="mb-4 lg:w-50"
            placeholder={t("vocabulary.searchForAWord")}
            value={(table.getColumn("word")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("word")?.setFilterValue(event.target.value)
            }
          />

          {(table.getColumn("word")?.getFilterValue() as string) && (
            <Button
              className="-ml-9 cursor-pointer opacity-50 hover:opacity-100"
              variant={null}
              size="icon"
              onClick={() => table.getColumn("word")?.setFilterValue("")}
              aria-label="Clear filter"
            >
              <IconX />
            </Button>
          )}
        </div>

        <LanguagePairSelector
          value={getFilterValue()}
          onChange={setLanguageFilter}
        />

        <DeleteTranslationsButton
          className="ml-auto"
          rowSelection={rowSelection}
        />

        <AddWordDialog />
      </div>

      <div className="rounded-md border">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {t("vocabulary.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
