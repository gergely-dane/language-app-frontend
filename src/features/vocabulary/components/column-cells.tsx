"use client";

import { IconArrowNarrowRight, IconPencil } from "@tabler/icons-react";
import type { CellContext } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguages } from "@/features/languages/api/get-languages";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

import type { Word } from "../interfaces/word.interface";
import { PlayAudioButton } from "./play-audio-button";

export const WordCell = ({ row }: CellContext<Translation, unknown>) => {
  const { words, sourceLanguageId } = row.original;
  const firstWord = words[0]?.word ?? "";
  const { getLanguageCode } = useLanguages();

  return (
    <div className="flex items-center gap-1.5">
      <span className="leading-none">
        {words.map((w) => w.word).join(", ")}
      </span>

      <PlayAudioButton
        text={firstWord}
        languageCode={getLanguageCode(sourceLanguageId)}
      />
    </div>
  );
};

export const TranslationsCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  return (getValue() as Word[])?.map((w: Word) => w.word)?.join(", ");
};

export const LanguageCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const isMobile = useIsMobileScreen();
  const { getLanguageString, getLanguageCode } = useLanguages();

  const [sourceLanguageId, targetLanguageId] = (getValue() as string).split(
    "-",
  );

  return (
    <div className="flex gap-0.5">
      <p>
        {!isMobile
          ? getLanguageString(Number(sourceLanguageId))
          : getLanguageCode(Number(sourceLanguageId)).toUpperCase()}
      </p>

      <IconArrowNarrowRight className="mt-0.5 shrink-0" size={16} />

      <p>
        {!isMobile
          ? getLanguageString(Number(targetLanguageId))
          : getLanguageCode(Number(targetLanguageId)).toUpperCase()}
      </p>
    </div>
  );
};

export const AddedOnCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const date = new Date(getValue() as string);
  return date.toLocaleDateString();
};

export type EditCellProps = CellContext<Translation, unknown> & {
  onEdit: (translation: Translation) => void;
};

export const EditCell = ({ row, onEdit }: EditCellProps) => {
  const rowData = row.original;

  return (
    <Button variant="outline" size="icon" onClick={() => onEdit(rowData)}>
      <IconPencil />
    </Button>
  );
};

export const SelectCell = ({ row }: CellContext<Translation, unknown>) => (
  <Checkbox
    className="mr-4 pt-4"
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    checked={row.getIsSelected()}
    aria-label="Select row"
  />
);
