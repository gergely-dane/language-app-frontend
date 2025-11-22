"use client";

import { Button } from "@/components/ui/button";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlert } from "@/context/alert-context";
import { useDeleteTranslationsBulk } from "@/features/vocabulary/api/delete-translations-bulk";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit-word-dialog";
import { DeleteTranslationsButton } from "@/features/vocabulary/components/delete-translations-button";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { LanguagePair } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { Translation } from "@/interfaces/translation.interface";
import { IconPlus } from "@tabler/icons-react";
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
import React, { useEffect } from "react";

interface VocabularyTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function VocabularyTable<TData, TValue>({
  columns,
  data,
}: VocabularyTableProps<TData, TValue>) {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const deleteTranslation = useDeleteTranslationsBulk();
  const { showAlert } = useAlert();

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [addWordDialogOpen, setAddWordDialogOpen] = React.useState(false);
  const [selectedRowCount, setSelectedRowCount] = React.useState(0);

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
      columnVisibility: { createdAt: !isMobile, select: false },
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: Translation) => row.id,
  });

  useEffect(() => {
    setSelectedRowCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  const getFilterValue = (): LanguagePair | null => {
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

  const handleDelete = async () => {
    if (!selectedRowCount) {
      return;
    }

    const ids = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => Number(key));

    try {
      await deleteTranslation.mutateAsync({ ids });

      setRowSelection({});
      showAlert({
        title: t("vocabulary.translationsDeletedSuccessfully"),
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete translations:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-1.5">
        <SearchInput
          value={(table.getColumn("word")?.getFilterValue() as string) ?? ""}
          onChange={(val) => table.getColumn("word")?.setFilterValue(val)}
          placeholder={t("vocabulary.searchForAWord")}
        />

        <LanguagePairSelector
          value={getFilterValue()}
          onChange={setLanguageFilter}
        />

        <DeleteTranslationsButton
          selectedRowCount={selectedRowCount}
          onDelete={handleDelete}
        />

        <Button variant="outline" onClick={() => setAddWordDialogOpen(true)}>
          <IconPlus />
          <p className="hidden lg:block">{t("vocabulary.addWord")}</p>
        </Button>

        <AddEditWordDialog
          open={addWordDialogOpen}
          onOpenChange={(open) => setAddWordDialogOpen(open)}
        />
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
