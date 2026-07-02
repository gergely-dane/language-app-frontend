"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationNavigator } from "@/features/vocabulary/components/pagination-navigator";
import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { type PaginatedResponse } from "@/interfaces/paginated-response.interface";

type VocabularyTableProps<TValue> = {
  columns: ColumnDef<Translation, TValue>[];
  words: PaginatedResponse<Translation> | undefined;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onPageChange?: (page: number) => void;
};

export const VocabularyTable = <TValue,>({
  columns,
  words,
  sorting,
  onSortingChange,
  onPageChange,
}: VocabularyTableProps<TValue>) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const table = useReactTable({
    data: words?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnVisibility: { createdAt: !isMobile, select: false },
    },
    getRowId: (row: Translation) => row.id.toString(),
  });

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
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

      {onPageChange && words && (
        <PaginationNavigator
          className="mt-4"
          currentPage={words.currentPage}
          totalPages={words.totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};
