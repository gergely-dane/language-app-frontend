"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  getFacetedUniqueValues,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { LanguagePairSelector } from "@/components/language-pair-selector";
import { IconTrash, IconX } from "@tabler/icons-react";
import AddWordDialog from "@/components/add-word-dialog";
import { Translation } from "@/hooks/use-translations";
import { DeleteTranslationsButton } from "@/components/delete-translations-button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "word", desc: false },
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
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: Translation) => row.id,
  });

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex">
          <Input
            placeholder="Search for a word..."
            value={(table.getColumn("word")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("word")?.setFilterValue(event.target.value)
            }
            className="mb-4 lg:w-50"
          />
          {(table.getColumn("word")?.getFilterValue() as string) && (
            <Button
              variant={null}
              size="icon"
              className="-ml-9 cursor-pointer opacity-50 hover:opacity-100 "
              onClick={() => table.getColumn("word")?.setFilterValue("")}
              aria-label="Clear filter"
            >
              <IconX />
            </Button>
          )}
        </div>
        <LanguagePairSelector
          value={
            (table.getColumn("language")?.getFilterValue() as string) ?? null
          }
          onChange={(event) =>
            table.getColumn("language")?.setFilterValue(event)
          }
          languagePairs={
            table
              .getColumn("language")
              ?.getFacetedUniqueValues()
              .keys()
              .toArray() || []
          }
        />
        <DeleteTranslationsButton rowSelection={rowSelection} />
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
