"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";

import { ScrollToTopButton } from "@/components/common/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/context/alert-context";
import { LanguagePairSelector } from "@/features/languages/components/language-pair-selector";
import { type LanguageFilterValue } from "@/features/languages/types";
import { useDeleteTranslationsBulk } from "@/features/vocabulary/api/delete-translations-bulk";
import { useTranslations } from "@/features/vocabulary/api/get-translations";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit/add-edit-word-dialog";
import { DeleteWordDialog } from "@/features/vocabulary/components/delete-word-dialog";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { VocabularyTable } from "@/features/vocabulary/components/table/vocabulary-table";
import { useColumns } from "@/features/vocabulary/hooks/use-columns";
import { type Translation } from "@/features/vocabulary/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useI18n } from "@/hooks/use-i18n";

export const VocabularyPage = () => {
  const t = useI18n();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<
    Translation | undefined
  >(undefined);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [languageFilter, setLanguageFilter] =
    useState<LanguageFilterValue | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const debouncedSearchFilter = useDebounce(searchFilter);
  const deleteTranslationsBulk = useDeleteTranslationsBulk();
  const { showAlert } = useAlert();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectedCount = Object.keys(rowSelection).length;

  const deleteSelected = () => {
    deleteTranslationsBulk.mutate(
      { ids: Object.keys(rowSelection).map(Number) },
      {
        onSuccess: () => {
          setRowSelection({});
          showAlert({
            title: t("vocabulary.translationsDeletedSuccessfully"),
          });
        },
        onError: () => {
          showAlert({
            title: t("vocabulary.errorDeletingTranslation"),
            variant: "destructive",
          });
        },
      },
    );
  };

  const { data: words, isFetching } = useTranslations({
    pageNumber,
    search: debouncedSearchFilter,
    sourceLanguageId: languageFilter?.sourceLanguageId,
    targetLanguageId: languageFilter?.targetLanguageId,
    sortBy: sorting[0]?.id ?? "createdAt",
    sortAscending: sorting[0] ? !sorting[0].desc : false,
  });

  const onEdit = useCallback((translation: Translation) => {
    setEditingTranslation(translation);
    setIsEditDialogOpen(true);
  }, []);
  const columns = useColumns(onEdit);

  const onWordDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--navbar-height))] w-full flex-col">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl">{t("vocabulary.title")}</h1>

        {!!words?.totalCount && (
          <p className="text-muted-foreground font-mono text-[13px]">
            {t("vocabulary.entries", { count: words.totalCount })}
          </p>
        )}
      </div>

      <p className="text-muted-foreground font-semibold">
        {t("vocabulary.anOverviewOfAllYourWords")}
      </p>

      <div className="mt-6 mb-1.5 flex flex-wrap gap-1.5">
        <SearchInput
          className="flex-7 lg:w-70 lg:flex-none"
          value={searchFilter}
          onChange={(value) => setSearchFilter(value)}
          placeholder={t("vocabulary.searchForAWord")}
        />

        <LanguagePairSelector
          className="flex-1 lg:flex-none"
          value={languageFilter}
          onChange={(value) => setLanguageFilter(value)}
          disabled={isFetching}
        />

        <Button
          className="ml-auto flex-1 lg:flex-none"
          onClick={() => {
            setEditingTranslation(undefined);
            setIsEditDialogOpen(true);
          }}
          disabled={isFetching}
        >
          <IconPlus className="h-4 w-4" />
          <p className="hidden lg:block">{t("vocabulary.addWord")}</p>
        </Button>
      </div>

      {selectedCount > 0 && (
        <div className="border-primary/30 bg-primary/10 mb-1.5 flex items-center justify-between rounded-lg border px-4 py-2">
          <p className="text-primary text-sm font-medium">
            {t("vocabulary.selection.selected", { count: selectedCount })}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              {t("vocabulary.selection.clear")}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              disabled={deleteTranslationsBulk.isPending}
              onClick={() => {
                if (selectedCount > 1) setDeleteDialogOpen(true);
                else deleteSelected();
              }}
            >
              <IconTrash className="size-3.5" />
              {t("vocabulary.deleteWords.delete")}
            </Button>
          </div>
        </div>
      )}

      <DeleteWordDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        wordCount={selectedCount}
        onDelete={deleteSelected}
      />

      <AddEditWordDialog
        open={isEditDialogOpen}
        onOpenChange={onWordDialogOpenChange}
        editMode={!!editingTranslation}
        currentTranslation={editingTranslation}
      />

      <VocabularyTable
        columns={columns}
        words={words}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onPageChange={(page) => setPageNumber(page)}
      />

      <ScrollToTopButton />
    </div>
  );
};
