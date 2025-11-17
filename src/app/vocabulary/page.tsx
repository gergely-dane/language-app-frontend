"use client";

import { columns } from "@/app/vocabulary/components/columns";
import { VocabularyTable } from "@/app/vocabulary/components/vocabulary-table";
import { useTranslations } from "@/app/vocabulary/hooks";
import { useI18n } from "@/hooks/use-i18n";

export default function Home() {
  const t = useI18n();

  const { data: words, isLoading, error } = useTranslations({});

  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!words) return <div>No words found</div>;

  return (
    <div className="lg:w-2/3 mx-auto p-3">
      <div className="text-3xl font-bold my-8">{t("vocabulary.title")}</div>
      <VocabularyTable columns={columns} data={words} />
    </div>
  );
}
