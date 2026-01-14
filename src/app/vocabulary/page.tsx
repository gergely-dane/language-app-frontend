"use client";

import { AddEditWordDialog } from "@/components/ui/add-edit-word-dialog";
import { Button } from "@/components/ui/button";
import { LanguagePairSelector } from "@/components/ui/language-pair-selector";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { columns } from "@/features/vocabulary/components/columns";
import { SearchInput } from "@/features/vocabulary/components/search-input";
import { VocabularyTable } from "@/features/vocabulary/components/vocabulary-table";
import { useDebounce } from "@/hooks/use-debounce";
import { useI18n } from "@/hooks/use-i18n";
import { LanguagePair } from "@/interfaces/language-pair.interface";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

const Vocabulary = () => {
  const t = useI18n();

  const [addWordDialogOpen, setAddWordDialogOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState<LanguagePair | null>(
    null,
  );

  const debouncedSearchFilter = useDebounce(searchFilter);

  return (
    <div className="w-full min-h-[calc(100vh-var(--navbar-height))]">
      <p className="text-3xl font-bold">{t("vocabulary.title")}</p>

      <p className="text-muted-foreground font-semibold">
        {t("vocabulary.anOverviewOfAllYourWords")}
      </p>

      <div className="flex gap-1.5 flex-wrap mt-6 mb-1.5">
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

export default Vocabulary;
