"use client";

import { useMemo } from "react";

import { useFlashcardDueCounts } from "@/features/flashcards/api/get-flashcard-due-counts";
import { CardDirectionSelector } from "@/features/flashcards/components/card-direction-selector";
import { CollapsibleSection } from "@/features/flashcards/components/collapsible-section";
import { DeckSetting } from "@/features/flashcards/components/deck-setting";
import { DeckSummary } from "@/features/flashcards/components/deck-summary";
import { PracticeModeSelector } from "@/features/flashcards/components/practice-mode-selector";
import type { PracticeMode } from "@/features/flashcards/types";
import { getLanguagePairLeftCounts } from "@/features/flashcards/utils";
import { LanguagePairSelector } from "@/features/languages/components/language-pair-selector";
import type { LanguageFilterValue } from "@/features/languages/types";
import { useI18n } from "@/hooks/use-i18n";

type DeckPanelProps = {
  languagePair: LanguageFilterValue | null;
  practiceMode: PracticeMode;
  isReverse: boolean;
  onLanguagePairChange: (languagePair: LanguageFilterValue) => void;
  onPracticeModeChange: (practiceMode: PracticeMode) => void;
  onReverseChange: (isReverse: boolean) => void;
};

export const DeckPanel = ({
  languagePair,
  practiceMode,
  isReverse,
  onLanguagePairChange,
  onPracticeModeChange,
  onReverseChange,
}: DeckPanelProps) => {
  const t = useI18n();

  const {
    data: dueCounts,
    isLoading: isDueCountsLoading,
    refetch: refetchDueCounts,
  } = useFlashcardDueCounts(isReverse);

  const leftCounts = useMemo(
    () => getLanguagePairLeftCounts(dueCounts ?? [], practiceMode),
    [dueCounts, practiceMode],
  );

  const onLanguagePairOpenChange = (open: boolean) => {
    if (open) void refetchDueCounts();
  };

  return (
    <CollapsibleSection
      section="deck"
      title={t("flashcards.deck")}
      summary={
        <DeckSummary
          languagePair={languagePair}
          practiceMode={practiceMode}
          isReverse={isReverse}
        />
      }
    >
      <DeckSetting label={t("flashcards.languages")}>
        <LanguagePairSelector
          className="w-full"
          value={languagePair}
          onChange={onLanguagePairChange}
          onOpenChange={onLanguagePairOpenChange}
          isLoading={isDueCountsLoading}
          pairCounts={leftCounts}
          countLabel={t("flashcards.left")}
        />
      </DeckSetting>

      <div className="flex flex-wrap gap-2 lg:contents">
        <DeckSetting className="grow" label={t("flashcards.practice")}>
          <PracticeModeSelector
            value={practiceMode}
            onChange={onPracticeModeChange}
          />
        </DeckSetting>

        <DeckSetting className="grow" label={t("flashcards.cardDirection")}>
          <CardDirectionSelector
            isReverse={isReverse}
            onChange={onReverseChange}
          />
        </DeckSetting>
      </div>
    </CollapsibleSection>
  );
};
