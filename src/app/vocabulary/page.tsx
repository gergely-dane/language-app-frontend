"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useTranslations,
  Tranlation,
  TranslationsResponse,
} from "@/hooks/useTranslations";

export default function Home() {
  const { data, isLoading, error } = useTranslations({});
  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!data) return <div>No words found</div>;

  return (
    <div className="flex justify-center w-full">
      <div className="w-[60%]">
        <div className="text-3xl font-bold my-8">Word List</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Translation(s)</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Added on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tranlation: TranslationsResponse) => (
              <TableRow key={tranlation.id}>
                <TableCell>{tranlation.word}</TableCell>
                <TableCell>
                  <span className="overflow-ellipsis overflow-hidden whitespace-nowrap w-[10px]">
                    {tranlation.translations.join(", ")}
                  </span>
                </TableCell>
                <TableCell>
                  {tranlation.sourceLanguageCode} {" → "}
                  {tranlation.translationLanguageCode}
                </TableCell>
                <TableCell>
                  {new Date(tranlation.createdDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
