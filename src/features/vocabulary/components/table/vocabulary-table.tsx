"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Loader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationNavigator } from "@/features/vocabulary/components/table/pagination-navigator";
import { type TranslationListItem } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";
import { type PaginatedResponse } from "@/types";

const EMPTY_DATA: TranslationListItem[] = [];

type VocabularyTableProps<TValue> = {
  columns: ColumnDef<TranslationListItem, TValue>[];
  words: PaginatedResponse<TranslationListItem> | undefined;
  isLoading?: boolean;
  isRefreshing?: boolean;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onPageChange?: (page: number) => void;
};

export const VocabularyTable = <TValue,>({
  columns,
  words,
  isLoading = false,
  isRefreshing = false,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  onPageChange,
}: VocabularyTableProps<TValue>) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const table = useReactTable({
    data: words?.data ?? EMPTY_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange,
    onRowSelectionChange,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      rowSelection,
      columnVisibility: { nextReview: !isMobile, createdAt: !isMobile },
    },
    getRowId: (row: TranslationListItem) => row.id.toString(),
  });

  return (
    <div>
      <div>
        <Table className="table-fixed" aria-busy={isRefreshing}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        (
                          header.column.columnDef.meta as unknown as {
                            className: string;
                          }
                        )?.className
                      }
                    >
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

          <TableBody
            className={cn(
              "transition-opacity",
              isRefreshing && "pointer-events-none opacity-50",
            )}
          >
            {isLoading ? (
              <TableRow>
                <TableCell className="h-24" colSpan={columns.length}>
                  <Loader />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (
                          cell.column.columnDef.meta as unknown as {
                            className: string;
                          }
                        )?.className
                      }
                    >
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

      {onPageChange && words && words.totalPages > 1 && (
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
