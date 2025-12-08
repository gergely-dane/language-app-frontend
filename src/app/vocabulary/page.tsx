"use client";

import { Button } from "@/components/ui/button";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { useAlert } from "@/context/alert-context";
import { useDeleteTranslationsBulk } from "@/features/vocabulary/api/delete-translations-bulk";
import { useTranslations } from "@/features/vocabulary/api/get-translations";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit-word-dialog";
import { columns } from "@/features/vocabulary/components/columns";
import { DeleteTranslationsButton } from "@/features/vocabulary/components/delete-translations-button";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { VocabularyTable } from "@/features/vocabulary/components/vocabulary-table";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { LanguagePair } from "@/interfaces/language-pair.interface";
import { Translation } from "@/interfaces/translation.interface";
import { IconPlus } from "@tabler/icons-react";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

const Vocabulary = () => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const deleteTranslation = useDeleteTranslationsBulk();
  const { showAlert } = useAlert();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [addWordDialogOpen, setAddWordDialogOpen] = useState(false);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  const { data: words, isLoading, error } = useTranslations({});

  const table = useReactTable({
    data: words ?? [],
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
    getRowId: (row: Translation) => row.id.toString(),
  });

  useEffect(() => {
    setSelectedRowCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  const getFilterValue = (): LanguagePair | null => {
    const filterValue = table.getColumn("language")?.getFilterValue() as string;
    if (!filterValue) return null;

    const [sourceLanguageCode, translationLanguageCode] =
      filterValue.split("-");
    return { sourceLanguageCode, translationLanguageCode };
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
    if (!selectedRowCount) return;

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

  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;

  return (
    <div className="w-full space-y-4">
      <div className="text-3xl font-bold">{t("vocabulary.title")}</div>

      <div className="flex gap-1.5 flex-wrap">
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

        <Button onClick={() => setAddWordDialogOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          <span className="hidden lg:block">{t("vocabulary.addWord")}</span>
        </Button>

        <AddEditWordDialog
          open={addWordDialogOpen}
          onOpenChange={(open) => setAddWordDialogOpen(open)}
        />
      </div>

      <VocabularyTable table={table} columns={columns} />
    </div>
  );
};

export default Vocabulary;
