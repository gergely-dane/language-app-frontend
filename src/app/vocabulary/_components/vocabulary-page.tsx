"use client";

import { IconPlus } from "@tabler/icons-react";
import { type SortingState } from "@tanstack/react-table";
import { useCallback, useState } from "react";

import { ScrollToTopButton } from "@/components/common/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { LanguagePairSelector } from "@/features/languages/components/language-pair-selector";
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { useTranslations } from "@/features/vocabulary/api/get-translations";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit/add-edit-word-dialog";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { VocabularyTable } from "@/features/vocabulary/components/table/vocabulary-table";
import { useColumns } from "@/features/vocabulary/hooks/use-columns";
import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
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
  const [languageFilter, setLanguageFilter] = useState<LanguagePair | null>(
    null,
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const debouncedSearchFilter = useDebounce(searchFilter);

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
      <p className="text-3xl font-bold">{t("vocabulary.title")}</p>

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
        onPageChange={(page) => setPageNumber(page)}
      />

      <ScrollToTopButton />
    </div>
  );
};
