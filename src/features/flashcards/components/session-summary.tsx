"use client";

import { SummaryDot } from "@/features/flashcards/components/summary-dot";
import { useI18n } from "@/hooks/use-i18n";

type SessionSummaryProps = {
  reviewedCount: number;
  remainingCount: number;
  remainingLabel: string;
};

export const SessionSummary = ({
  reviewedCount,
  remainingCount,
  remainingLabel,
}: SessionSummaryProps) => {
  const t = useI18n();

  return (
    <>
      <span className="shrink-0 tabular-nums">
        {reviewedCount} {t("flashcards.reviewed")}
      </span>

      <SummaryDot />

      <span className="truncate tabular-nums">
        {remainingCount} {remainingLabel}
      </span>
    </>
  );
};
