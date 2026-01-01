"use client";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { useAlert } from "@/context/alert-context";
import { useDeleteTranslationsBulk } from "@/features/vocabulary/api/delete-translations-bulk";
import { useTranslations } from "@/features/vocabulary/api/get-translations";
import { columns } from "@/features/vocabulary/components/columns";
import { PaginationNavigator } from "@/features/vocabulary/components/pagination-navigator";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { VocabularyTable } from "@/features/vocabulary/components/vocabulary-table";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { LanguagePair } from "@/interfaces/language-pair.interface";
import { Translation } from "@/interfaces/translation.interface";
import { IconPlus } from "@tabler/icons-react";
import {
  getCoreRowModel,
  getFacetedUniqueValues,
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [addWordDialogOpen, setAddWordDialogOpen] = useState(false);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState<LanguagePair | null>(
    null,
  );

  const {
    data: words,
    isLoading,
    error,
    refetch,
  } = useTranslations({
    pageNumber,
    search: searchFilter,
    sourceLanguageId: languageFilter?.sourceLanguageId,
    translationLanguageId: languageFilter?.translationLanguageId,
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

  useEffect(() => {
    setSelectedRowCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  useEffect(() => {
    refetch();
  }, [pageNumber, searchFilter, languageFilter, refetch]);

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

  return (
    <div className="w-full min-h-[calc(100vh-var(--navbar-height))]">
      <div className="text-3xl font-bold">{t("vocabulary.title")}</div>

      <div className="flex gap-1.5 flex-wrap mt-4 mb-1.5">
        <SearchInput
          className="flex-7 lg:flex-none lg:w-70"
          value={searchFilter}
          onChange={(value) => setSearchFilter(value)}
          placeholder={t("vocabulary.searchForAWord")}
        />

        <LanguagePairSelector
          className="flex-1 lg:flex-none"
          value={languageFilter}
          onChange={(value) => setLanguageFilter(value)}
        />

        {/*<DeleteTranslationsButton*/}
        {/*  selectedRowCount={selectedRowCount}*/}
        {/*  onDelete={handleDelete}*/}
        {/*/>*/}

        <Button
          className="ml-auto flex-1 lg:flex-none"
          onClick={() => setAddWordDialogOpen(true)}
        >
          <IconPlus className="h-4 w-4" />
          <p className="hidden lg:block">{t("vocabulary.addWord")}</p>
        </Button>

        <AddEditWordDialog
          open={addWordDialogOpen}
          onOpenChange={(open) => setAddWordDialogOpen(open)}
        />
      </div>

      <VocabularyTable table={table} columns={columns} />

      {words && (
        <PaginationNavigator
          className="mt-2"
          currentPage={words.currentPage}
          totalPages={words.totalPages}
          onChange={(page) => setPageNumber(page)}
        />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default Vocabulary;
