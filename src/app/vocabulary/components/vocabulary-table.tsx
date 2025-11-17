"use client";

import { DeleteWordDialog } from "@/app/vocabulary/components/delete-word-dialog";
import { Translation, useDeleteTranslationsBulk } from "@/app/vocabulary/hooks";
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
import { useAlert } from "@/context/alert-context";
import { LanguagePair } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
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
import { AddEditWordDialog } from "./add-edit-word-dialog";
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
  const [deleteWordDialogOpen, setDeleteWordDialogOpen] = React.useState(false);
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
      columnVisibility: { createdAt: !isMobile, select: !isMobile },
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

  const deleteClicked = () => {
    if (selectedRowCount > 1) {
      setDeleteWordDialogOpen(true);
      return;
    }

    handleDelete();
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

        <Button
          className="ml-auto"
          variant="outline"
          onClick={deleteClicked}
          disabled={!rowSelection || !Object.keys(rowSelection).length}
        >
          <IconTrash className="text-destructive" />
        </Button>

        <DeleteWordDialog
          open={deleteWordDialogOpen}
          onOpenChange={(open) => setDeleteWordDialogOpen(open)}
          wordCount={selectedRowCount}
          onDelete={handleDelete}
        />

        <Button variant="outline" onClick={() => setAddWordDialogOpen(true)}>
          <IconPlus />
          <span className="hidden lg:block">{t("vocabulary.addWord")}</span>
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
