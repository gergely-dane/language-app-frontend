"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";

import {
  PRACTICE_MODE_OPTIONS,
  SHOW_FIRST_OPTIONS,
} from "@/features/flashcards/constants";
import type { PracticeMode } from "@/features/flashcards/types";
import { useLanguages } from "@/features/languages/api/get-languages";
import type { LanguageFilterValue } from "@/features/languages/types";
import { useI18n } from "@/hooks/use-i18n";

type DeckSummaryProps = {
  languagePair: LanguageFilterValue | null;
  practiceMode: PracticeMode;
  isReverse: boolean;
};

const SummaryDot = () => (
  <span
    aria-hidden
    className="bg-muted-foreground size-0.5 shrink-0 rounded-full"
  />
);

export const DeckSummary = ({
  languagePair,
  practiceMode,
  isReverse,
}: DeckSummaryProps) => {
  const t = useI18n();
  const { getLanguageCode } = useLanguages();

  const getLanguageLabel = (id?: number | null) =>
    id ? getLanguageCode(id).toUpperCase() : t("vocabulary.any");

  const practiceOption = PRACTICE_MODE_OPTIONS.find(
    (option) => option.value === practiceMode,
  );
  const showFirstOption = SHOW_FIRST_OPTIONS.find(
    (option) => option.value === isReverse,
  );

  return (
    <span className="text-foreground/80 flex min-w-0 items-center gap-1.5 text-xs font-normal tracking-normal normal-case">
      <span className="flex shrink-0 items-center gap-0.5">
        {getLanguageLabel(languagePair?.sourceLanguageId)}
        <IconArrowNarrowRight size={12} />
        {getLanguageLabel(languagePair?.targetLanguageId)}
      </span>

      {practiceOption && (
        <>
          <SummaryDot />

          <span className="shrink-0">
            {t(`flashcards.${practiceOption.label}`)}
          </span>
        </>
      )}

      {showFirstOption && (
        <>
          <SummaryDot />

          <span className="truncate">
            {t(`flashcards.${showFirstOption.summary}`)}
          </span>
        </>
      )}
    </span>
  );
};
