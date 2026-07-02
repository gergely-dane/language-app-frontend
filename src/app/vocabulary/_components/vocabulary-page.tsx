"use client";

import { IconPlus } from "@tabler/icons-react";
import { useCallback, useState } from "react";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { VocabularyTable } from "@/features/vocabulary/components/vocabulary-table";
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

  const debouncedSearchFilter = useDebounce(searchFilter);
  const onEdit = useCallback((translation: Translation) => {
    setEditingTranslation(translation);
    setIsEditDialogOpen(true);
  }, []);
  const columns = useColumns(onEdit);

  const onWordDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
  };

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height))] w-full">
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
        />

        <Button
          className="ml-auto flex-1 lg:flex-none"
          onClick={() => {
            setEditingTranslation(undefined);
            setIsEditDialogOpen(true);
          }}
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
        filters={{
          search: debouncedSearchFilter,
          languageFilter,
          pageNumber,
        }}
        onPageChange={(page) => setPageNumber(page)}
      />

      <ScrollToTopButton />
    </div>
  );
};
