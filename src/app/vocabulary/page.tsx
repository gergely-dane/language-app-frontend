"use client";

import { useTranslations } from "@/features/vocabulary/api/get-translations";
import { columns } from "@/features/vocabulary/components/columns";
import { VocabularyTable } from "@/features/vocabulary/components/vocabulary-table";
import { useI18n } from "@/hooks/use-i18n";

export const Vocabulary = () => {
  const t = useI18n();

  const { data: words, isLoading, error } = useTranslations({});

  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!words) return <div>No words found</div>;

  return (
    <div>
      <div className="text-3xl font-bold mb-4">{t("vocabulary.title")}</div>
      <VocabularyTable columns={columns} data={words} />
    </div>
  );
};

export default Vocabulary;
