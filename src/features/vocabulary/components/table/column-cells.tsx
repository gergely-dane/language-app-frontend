"use client";

import { IconPencil } from "@tabler/icons-react";
import type { CellContext } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguages } from "@/features/languages/api/get-languages";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";

import { PlayAudioButton } from "../play-audio-button";

export const WordCell = ({ row }: CellContext<Translation, unknown>) => {
  const { words, sourceLanguageId } = row.original;
  const { getLanguageCode, getLanguageString } = useLanguages();

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-muted-foreground text-xs font-semibold">
        {getLanguageString(sourceLanguageId)}
      </p>

      {words.map((w) => (
        <div key={w.id} className="flex min-w-0 items-center gap-1">
          <span className="-my-1 min-w-0 truncate" title={w.word}>
            {w.word}
          </span>

          <PlayAudioButton
            text={w.word}
            languageCode={getLanguageCode(sourceLanguageId)}
          />
        </div>
      ))}
    </div>
  );
};

export const TranslationsCell = ({
  row,
}: CellContext<Translation, unknown>) => {
  const { translations, targetLanguageId } = row.original;
  const { getLanguageCode, getLanguageString } = useLanguages();

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-muted-foreground text-xs font-semibold">
        {getLanguageString(targetLanguageId)}
      </p>

      {translations.map((w) => (
        <div key={w.id} className="flex min-w-0 items-center gap-1">
          <span className="-my-1 min-w-0 truncate" title={w.word}>
            {w.word}
          </span>

          <PlayAudioButton
            text={w.word}
            languageCode={getLanguageCode(targetLanguageId)}
          />
        </div>
      ))}
    </div>
  );
};

export const AddedOnCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const date = new Date(getValue() as string);
  return <p className="text-[0.8rem]">{date.toLocaleDateString()}</p>;
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
