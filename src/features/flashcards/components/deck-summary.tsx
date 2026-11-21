"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";

import { SummaryDot } from "@/features/flashcards/components/summary-dot";
import {
  CARD_DIRECTION_OPTIONS,
  PRACTICE_MODE_OPTIONS,
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
  const cardDirectionOption = CARD_DIRECTION_OPTIONS.find(
    (option) => option.value === isReverse,
  );

  return (
    <>
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

      {cardDirectionOption && (
        <>
          <SummaryDot />

          <span className="truncate">
            {t(`flashcards.${cardDirectionOption.label}`)}
          </span>
        </>
      )}
    </>
  );
};
