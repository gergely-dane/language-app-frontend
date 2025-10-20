"use client";

import { columns } from "@/app/vocabulary/components/columns";
import { DataTable } from "@/app/vocabulary/components/data-table";
import { useTranslations } from "@/app/vocabulary/hooks";
import { useI18n } from "@/hooks/use-i18n";

export default function Home() {
  const t = useI18n();

  const { data: words, isLoading, error } = useTranslations({});
  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!words) return <div>No words found</div>;

  return (
    <div className="w-[95%] lg:w-[60%] mx-auto">
      <div className="text-3xl font-bold my-8">{t("vocabulary.title")}</div>
      <DataTable columns={columns} data={words} />
    </div>
  );
}
