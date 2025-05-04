"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWords, Word } from "@/hooks/useWords";

export default function Home() {
  const { data, isLoading, error } = useWords({});
  if (isLoading) return <div>Loading words...</div>;
  if (error) return <div>Error loading words</div>;
  if (!data) return <div>No words found</div>;

  return (
    <div className="flex justify-center w-full">
      <div className="w-[60%]">
        <Table>
          <TableCaption>A list of your saved words.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Translation</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Added on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((word: Word) => (
              <TableRow key={word.id}>
                <TableCell>{word.originalWord}</TableCell>
                <TableCell>{word.translatedWord}</TableCell>
                <TableCell>
                  {word.originalLanguageEnglish} {" → "}
                  {word.translationLanguageEnglish}
                </TableCell>
                <TableCell>
                  {new Date(word.createdDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
