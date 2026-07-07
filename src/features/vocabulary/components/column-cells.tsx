"use client";

import {
  IconArrowNarrowRight,
  IconPencil,
  IconVolume,
} from "@tabler/icons-react";
import type { CellContext } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useSynthesizeSpeech } from "@/features/vocabulary/api/synthesize-speech";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

import type { Word } from "../interfaces/word.interface";

const audioCache = new Map<string, string>();

export const WordCell = ({ row }: CellContext<Translation, unknown>) => {
  const { word, sourceLanguageId } = row.original;
  const { getLanguageCode } = useLanguages();
  const synthesizeSpeech = useSynthesizeSpeech();

  const handlePlayAudio = async () => {
    const languageCode = getLanguageCode(sourceLanguageId);
    const cacheKey = `${word.word}_${languageCode}`;

    if (audioCache.has(cacheKey)) {
      const url = audioCache.get(cacheKey)!;
      void new Audio(url).play();
      return;
    }

    try {
      const blob = await synthesizeSpeech.mutateAsync({
        text: word.word,
        languageCode,
      });
      const url = URL.createObjectURL(blob);
      audioCache.set(cacheKey, url);
      void new Audio(url).play();
    } catch (error) {
      console.error("Failed to play audio", error);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="leading-none">{word.word}</span>

      <button
        onClick={() => void handlePlayAudio()}
        disabled={synthesizeSpeech.isPending}
        className="text-primary/50 hover:text-primary -mb-0.5 cursor-pointer transition-colors disabled:opacity-50"
        aria-label="Play audio"
      >
        <IconVolume size={16} />
      </button>
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

export const KnowledgeLevelCell = ({
  getValue,
}: CellContext<Translation, unknown>) => {
  const level = Math.ceil((getValue() as number) / 25);
  const colors = [
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-green-500",
  ] as const;

  return <div className={cn("h-4 w-4 rounded-full", colors[level])} />;
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
