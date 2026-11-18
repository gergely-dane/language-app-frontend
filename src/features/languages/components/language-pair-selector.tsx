"use client";

import { IconArrowNarrowRight, IconSelector } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useLanguages } from "@/features/languages/api/get-languages";
import { LanguageCountList } from "@/features/languages/components/language-count-list";
import {
  type LanguageFilterValue,
  type LanguagePair,
} from "@/features/languages/types";
import { getLanguageOptions } from "@/features/languages/utils";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";

type LanguagePairSelectorProps = {
  className?: string;
  value: LanguageFilterValue | null;
  onChange: (value: LanguageFilterValue) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
  pairCounts?: LanguagePair[];
  countLabel?: string;
};

export const LanguagePairSelector = ({
  className,
  value,
  onChange,
  onOpenChange,
  disabled = false,
  isLoading = false,
  pairCounts,
  countLabel,
}: LanguagePairSelectorProps) => {
  const [open, setOpen] = useState(false);

  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const { getLanguageString, isLoading: isLanguagesLoading } = useLanguages();
  const { data: languagePairs = [], isLoading: isLanguagePairsLoading } =
    useLanguagePairs();

  const columnCountLabel = countLabel ?? t("vocabulary.words");

  const currentSourceId = value?.sourceLanguageId || null;
  const currentTargetId = value?.targetLanguageId || null;

  const sourceLanguages = useMemo(
    () =>
      getLanguageOptions(languagePairs, "source", currentTargetId, pairCounts),
    [languagePairs, currentTargetId, pairCounts],
  );

  const translationLanguages = useMemo(
    () =>
      getLanguageOptions(languagePairs, "target", currentSourceId, pairCounts),
    [languagePairs, currentSourceId, pairCounts],
  );

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSelect = (type: "source" | "translation", id: number | null) => {
    onChange({
      sourceLanguageId: type === "source" ? id : currentSourceId,
      targetLanguageId: type === "translation" ? id : currentTargetId,
    });
  };

  if (isLoading || isLanguagesLoading || isLanguagePairsLoading) {
    return (
      <Skeleton className={cn("h-9 min-h-9 min-w-32 rounded-md", className)} />
    );
  }

  return (
    <div className={className}>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            className="w-full justify-between gap-1 font-normal [&>[data-slot=button-content]]:w-full [&>[data-slot=button-content]]:justify-between"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            <div className="flex items-center gap-2 truncate">
              <p className="truncate">
                {currentSourceId
                  ? getLanguageString(currentSourceId)
                  : t("vocabulary.any")}
              </p>

              <IconArrowNarrowRight className="mt-0.5 shrink-0" />

              <p className="truncate">
                {currentTargetId
                  ? getLanguageString(currentTargetId)
                  : t("vocabulary.any")}
              </p>
            </div>

            <IconSelector className="shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[300px] p-0"
          align="start"
          onOpenAutoFocus={(e) => isMobile && e.preventDefault()}
        >
          <div className="flex flex-row divide-x">
            <LanguageCountList
              className="flex-1 rounded-r-none"
              heading={t("general.from")}
              countLabel={columnCountLabel}
              anyLabel={t("vocabulary.any")}
              anyValue="any-source"
              languageCounts={sourceLanguages}
              selectedId={currentSourceId}
              onSelect={(id) => handleSelect("source", id)}
            />

            <LanguageCountList
              className="flex-1"
              heading={t("general.to")}
              countLabel={columnCountLabel}
              anyLabel={t("vocabulary.any")}
              anyValue="any-translation"
              languageCounts={translationLanguages}
              selectedId={currentTargetId}
              onSelect={(id) => handleSelect("translation", id)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
