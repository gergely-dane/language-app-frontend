"use client";

import { useTranslations } from "@/hooks/use-translations";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/vocabulary/columns";

export default function Home() {
  const { data, isLoading, error } = useTranslations({});
  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!data) return <div>No words found</div>;

  return (
    <div className="w-[95%] lg:w-[60%] mx-auto">
      <div className="text-3xl font-bold my-8">Word List</div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
