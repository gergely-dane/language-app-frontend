"use client";

import { Kbd } from "@/components/ui/kbd";
import { SectionLabel } from "@/features/flashcards/components/section-label";
import {
  FLASHCARD_DIRECTIONS,
  FLASHCARD_RATING_META,
} from "@/features/flashcards/constants";
import type { Direction } from "@/features/flashcards/types";
import { useI18n } from "@/hooks/use-i18n";

type ShortcutsPanelProps = {
  ratingLabels: Record<Direction, string>;
};

export const ShortcutsPanel = ({ ratingLabels }: ShortcutsPanelProps) => {
  const t = useI18n();

  const shortcuts = [
    { label: t("flashcards.flipCard"), kbd: "Space" },
    ...FLASHCARD_DIRECTIONS.map((direction) => ({
      label: ratingLabels[direction],
      kbd: FLASHCARD_RATING_META[direction].kbd,
    })),
  ];

  return (
    <section className="bg-card hidden flex-col gap-2 rounded-xl border p-4 lg:flex">
      <SectionLabel>{t("flashcards.shortcuts")}</SectionLabel>

      {shortcuts.map(({ label, kbd }) => (
        <div key={kbd} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <Kbd>{kbd}</Kbd>
        </div>
      ))}
    </section>
  );
};
