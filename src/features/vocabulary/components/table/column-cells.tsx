"use client";

import { IconPencil } from "@tabler/icons-react";
import type { CellContext } from "@tanstack/react-table";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguages } from "@/features/languages/api/get-languages";
import { DefinitionInfo } from "@/features/vocabulary/components/definition-info";
import { NextReviewLine } from "@/features/vocabulary/components/table/next-review-line";
import type {
  Translation,
  TranslationListItem,
} from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

import { PlayAudioButton } from "../play-audio-button";

export const WordCell = ({
  row,
}: CellContext<TranslationListItem, unknown>) => {
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
}: CellContext<TranslationListItem, unknown>) => {
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

export const NextReviewCell = ({
  row,
}: CellContext<TranslationListItem, unknown>) => {
  const { nextReviewDate, reverseNextReviewDate } = row.original;
  const t = useI18n();

  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-1 text-xs">
      <NextReviewLine
        label={t("vocabulary.nextReview.normal")}
        nextReviewDate={nextReviewDate}
      />

      <NextReviewLine
        label={t("vocabulary.nextReview.reverse")}
        nextReviewDate={reverseNextReviewDate}
      />
    </div>
  );
};

export const AddedOnCell = ({
  getValue,
}: CellContext<TranslationListItem, unknown>) => {
  const date = new Date(getValue() as string);
  return (
    <p className="text-muted-foreground font-mono text-xs">
      {date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </p>
  );
};

export const DefinitionCell = ({
  row,
}: CellContext<TranslationListItem, unknown>) => {
  const { definition } = row.original;

  if (!definition) return null;

  return (
    <DefinitionInfo
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "hover:bg-muted dark:hover:bg-muted opacity-0 transition-opacity group-hover:opacity-100 max-lg:opacity-100",
      )}
      iconClassName="size-4"
      definition={definition}
    />
  );
};

export type EditCellProps = CellContext<TranslationListItem, unknown> & {
  onEdit: (translation: Translation) => void;
};

export const EditCell = ({ row, onEdit }: EditCellProps) => {
  const rowData = row.original;

  return (
    <Button
      className="hover:bg-muted dark:hover:bg-muted opacity-0 transition-opacity group-hover:opacity-100 max-lg:opacity-100"
      variant="ghost"
      size="icon"
      onClick={() => onEdit(rowData)}
    >
      <IconPencil />
    </Button>
  );
};

export const SelectCell = ({
  row,
}: CellContext<TranslationListItem, unknown>) => {
  const t = useI18n();

  return (
    <Checkbox
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      checked={row.getIsSelected()}
      aria-label={t("vocabulary.selection.selectRow")}
    />
  );
};
