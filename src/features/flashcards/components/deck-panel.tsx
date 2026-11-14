"use client";

import { CollapsibleSection } from "@/features/flashcards/components/collapsible-section";
import { DeckSetting } from "@/features/flashcards/components/deck-setting";
import { DeckSummary } from "@/features/flashcards/components/deck-summary";
import { PracticeModeSelector } from "@/features/flashcards/components/practice-mode-selector";
import { ShowFirstSelector } from "@/features/flashcards/components/show-first-selector";
import type { PracticeMode } from "@/features/flashcards/types";
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
        />
      </DeckSetting>

      <div className="flex flex-wrap gap-2 lg:contents">
        <DeckSetting className="grow" label={t("flashcards.practice")}>
          <PracticeModeSelector
            value={practiceMode}
            onChange={onPracticeModeChange}
          />
        </DeckSetting>

        <DeckSetting className="grow" label={t("flashcards.showFirst")}>
          <ShowFirstSelector isReverse={isReverse} onChange={onReverseChange} />
        </DeckSetting>
      </div>
    </CollapsibleSection>
  );
};
