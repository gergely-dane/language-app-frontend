"use client";

import { useFormatter, useNow } from "next-intl";

import { Tooltip } from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";

type NextReviewLineProps = {
  label: string;
  nextReviewDate?: string | null;
};

export const NextReviewLine = ({
  label,
  nextReviewDate,
}: NextReviewLineProps) => {
  const t = useI18n();
  const format = useFormatter();
  const now = useNow();

  const date = nextReviewDate ? new Date(nextReviewDate) : null;

  return (
    <>
      <span className="text-muted-foreground font-semibold">{label}</span>

      {date ? (
        <Tooltip
          content={t("vocabulary.nextReview.exactDate", {
            date: date.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
          })}
        >
          <span
            tabIndex={0}
            className="focus-visible:ring-ring/50 cursor-help justify-self-start truncate rounded-sm font-mono outline-none focus-visible:ring-[3px]"
          >
            {date <= now
              ? t("vocabulary.nextReview.due")
              : format.relativeTime(date, now)}
          </span>
        </Tooltip>
      ) : (
        <span className="text-muted-foreground truncate font-mono">
          {t("vocabulary.nextReview.new")}
        </span>
      )}
    </>
  );
};
