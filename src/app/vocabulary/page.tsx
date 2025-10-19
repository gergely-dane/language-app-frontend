"use client";

import { columns } from "@/app/vocabulary/components/columns";
import { DataTable } from "@/app/vocabulary/components/data-table";
import { useTranslations } from "@/app/vocabulary/hooks";

export default function Home() {
  const { data: words, isLoading, error } = useTranslations({});
  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!words) return <div>No words found</div>;

  return (
    <div className="w-[95%] lg:w-[60%] mx-auto">
      <div className="text-3xl font-bold my-8">Word List</div>
      <DataTable columns={columns} data={words} />
    </div>
  );
}
